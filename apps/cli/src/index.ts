import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import * as schema from '@jsonblog/schema';
import { generateBlog } from '@jsonblog/generator-boilerplate';
import express from 'express';
import chokidar from 'chokidar';
import chalk from 'chalk';

// ESM-safe __dirname (the CLI is built as ESM, so the CommonJS __dirname is not
// available — this is what previously crashed `jsonblog init`).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

const BUILD_PATH = path.join(process.cwd(), 'build');
const DEFAULT_GENERATOR = '@jsonblog/generator-boilerplate';

// --- human-friendly output (the CLI speaks to a person, not a log aggregator) ---
const out = {
  step: (m: string) => console.log(chalk.cyan('→ ') + m),
  ok: (m: string) => console.log(chalk.green('✓ ') + m),
  warn: (m: string) => console.warn(chalk.yellow('! ') + m),
  err: (m: string) => console.error(chalk.red('✗ ') + m),
  info: (m: string) => console.log(chalk.dim(m)),
};

const getGeneratorName = (blog: any, cliOption?: string): string =>
  blog.generator?.name || cliOption || DEFAULT_GENERATOR;

const getGeneratorConfig = (blog: any): Record<string, any> => blog.generator?.config || {};

const getGenerator = async (generatorName: string) => {
  if (generatorName === DEFAULT_GENERATOR) return generateBlog;
  const customGen: any = await import(generatorName);
  return customGen.default || customGen.generateBlog || customGen;
};

const getBlog = (file: string) => {
  const blogPath = path.resolve(file);
  if (!fs.existsSync(blogPath)) {
    out.err(`No config found at ${chalk.bold(file)}. Run ${chalk.bold('jsonblog init')} to create one.`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(blogPath, 'utf-8'));
  } catch (error) {
    out.err(`Could not parse ${chalk.bold(file)}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

/** Validate a blog config. Returns true if valid; prints the error otherwise. */
const validate = async (blog: unknown): Promise<boolean> => {
  const result = await schema.validateBlog(blog);
  if (!result.success) {
    out.err(`Invalid blog config: ${result.error}`);
    return false;
  }
  return true;
};

/** Build the blog to BUILD_PATH. Returns true on success. */
const build = async (blog: any, generatorName: string): Promise<boolean> => {
  if (!(await validate(blog))) return false;
  const generator = await getGenerator(generatorName);
  const generatorConfig = getGeneratorConfig(blog);
  try {
    const files: { name: string; content: string }[] = await generator(
      blog,
      process.cwd(),
      generatorConfig
    );
    fs.removeSync(BUILD_PATH);
    fs.mkdirSync(BUILD_PATH, { recursive: true });
    for (const file of files) {
      fs.outputFileSync(path.join(BUILD_PATH, file.name), file.content, 'utf8');
    }
    out.ok(`Built ${chalk.bold(String(files.length))} files to ${chalk.bold('./build')} (via ${generatorName})`);
    return true;
  } catch (error) {
    out.err(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

// --- live-reload for `dev`: SSE endpoint + a tiny injected client script ---
const LIVE_RELOAD_SNIPPET =
  '<script>new EventSource("/__livereload").onmessage=()=>location.reload();</script>';

const program = new Command();
program.name('jsonblog').description('CLI tool for JsonBlog').version(pkg.version);

program
  .command('init')
  .description('Create an example blog.json')
  .option('-f, --force', 'Overwrite an existing blog.json')
  .action((options) => {
    const samplesDir = path.join(__dirname, '..', 'samples');
    const targetPath = path.join(process.cwd(), 'blog.json');
    if (fs.existsSync(targetPath) && !options.force) {
      out.err(`blog.json already exists. Use ${chalk.bold('--force')} to overwrite.`);
      process.exit(1);
    }
    // Copy the whole sample (blog.json + any content it references) so that
    // `jsonblog init && jsonblog build` works out of the box.
    for (const name of fs.readdirSync(samplesDir)) {
      fs.copyFileSync(path.join(samplesDir, name), path.join(process.cwd(), name));
    }
    out.ok('Created blog.json — edit it, then run ' + chalk.bold('jsonblog build'));
  });

program
  .command('validate')
  .description('Validate a blog config against the schema')
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config) => {
    const blog = getBlog(config);
    if (await validate(blog)) {
      out.ok(`${chalk.bold(config)} is valid`);
    } else {
      process.exitCode = 1;
    }
  });

program
  .command('build')
  .description('Build the blog')
  .option('-g, --generator <name>', 'Generator to use (overridden by blog.json if specified)')
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const blog = getBlog(config);
    const generatorName = getGeneratorName(blog, options.generator);
    out.step(`Building ${chalk.bold(config)}…`);
    if (!(await build(blog, generatorName))) process.exitCode = 1;
  });

program
  .command('serve')
  .description('Serve the built blog')
  .option('-p, --port <number>', 'Port to serve on', '3000')
  .action((options) => {
    const port = parseInt(options.port, 10);
    if (!fs.existsSync(BUILD_PATH)) {
      out.err(`No ./build directory. Run ${chalk.bold('jsonblog build')} first.`);
      process.exit(1);
    }
    const app = express();
    app.use(express.static(BUILD_PATH));
    app.listen(port, () => out.ok(`Serving ./build at ${chalk.bold(`http://localhost:${port}`)}`));
  });

program
  .command('watch')
  .description('Watch for changes and rebuild')
  .option('-g, --generator <name>', 'Generator to use (overridden by blog.json if specified)')
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const rebuild = async () => {
      const blog = getBlog(config);
      await build(blog, getGeneratorName(blog, options.generator));
    };
    await rebuild();
    let timer: NodeJS.Timeout | undefined;
    const debounced = () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 100);
    };
    const watcher = chokidar.watch([config, 'content/**/*', 'pages/**/*', 'posts/**/*'], {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
      persistent: true,
    });
    watcher.on('add', debounced).on('change', debounced).on('unlink', debounced);
    out.step(`Watching ${chalk.bold(config)} + content for changes… (Ctrl-C to stop)`);
  });

program
  .command('dev')
  .description('Build, serve, and live-reload on changes')
  .option('-g, --generator <name>', 'Generator to use (overridden by blog.json if specified)')
  .option('-p, --port <number>', 'Port to serve on', '3000')
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const port = parseInt(options.port, 10);
    const rebuild = async () => {
      const blog = getBlog(config);
      return build(blog, getGeneratorName(blog, options.generator));
    };
    out.step(`Building ${chalk.bold(config)}…`);
    await rebuild();

    const clients: express.Response[] = [];
    const app = express();
    app.get('/__livereload', (_req, res) => {
      res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.flushHeaders();
      clients.push(res);
      _req.on('close', () => {
        const i = clients.indexOf(res);
        if (i >= 0) clients.splice(i, 1);
      });
    });
    // Serve build/, injecting the live-reload snippet into HTML responses.
    app.use((req, res, next) => {
      if (!req.path.endsWith('/') && !req.path.endsWith('.html')) return next();
      const file = path.join(BUILD_PATH, req.path.endsWith('/') ? req.path + 'index.html' : req.path);
      if (!fs.existsSync(file)) return next();
      const html = fs.readFileSync(file, 'utf8').replace('</body>', LIVE_RELOAD_SNIPPET + '</body>');
      res.type('html').send(html);
    });
    app.use(express.static(BUILD_PATH));
    app.listen(port, () => out.ok(`Dev server at ${chalk.bold(`http://localhost:${port}`)} (live-reload on)`));

    let timer: NodeJS.Timeout | undefined;
    const watcher = chokidar.watch([config, 'content/**/*', 'pages/**/*', 'posts/**/*'], {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
      persistent: true,
    });
    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        if (await rebuild()) {
          for (const res of clients) res.write('data: reload\n\n');
        }
      }, 100);
    };
    watcher.on('add', onChange).on('change', onChange).on('unlink', onChange);
  });

program.parse();
