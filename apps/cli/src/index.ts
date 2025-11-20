import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import * as schema from '@jsonblog/schema';
import { generateBlog } from '@jsonblog/generator-boilerplate';
import express from 'express';
import chokidar from 'chokidar';
import logger from './logger.js';

const BUILD_PATH = `${process.cwd()}/./build`;
const DEFAULT_GENERATOR = '@jsonblog/generator-boilerplate';

// Get generator name from blog.json or CLI flag (blog.json takes precedence)
const getGeneratorName = (blog: any, cliOption?: string): string => {
  if (blog.generator?.name) {
    return blog.generator.name;
  }
  return cliOption || DEFAULT_GENERATOR;
};

// Get generator configuration from blog.json
const getGeneratorConfig = (blog: any): Record<string, any> => {
  return blog.generator?.config || {};
};

const getGenerator = async (generatorName?: string) => {
  if (!generatorName) {
    logger.info('Using default generator');
    return generateBlog;
  }
  logger.info({ generator: generatorName }, 'Using custom generator');
  // For custom generators, use dynamic import
  const customGen = await import(generatorName);
  return customGen.default || customGen.generateBlog || customGen;
};

const build = async (generator: any, blog: any) => {
  logger.info('Starting build process');
  const result = await schema.validateBlog(blog);
  if (!result.success) {
    logger.error({ error: result.error }, 'Blog validation failed');
    return;
  }

  // Get the directory of the blog.json file to use as base path
  const blogDir = process.cwd();
  const generatorConfig = getGeneratorConfig(blog);
  const hasConfig = Object.keys(generatorConfig).length > 0;

  logger.debug({
    basePath: blogDir,
    hasGeneratorConfig: hasConfig
  }, 'Using base path and generator config');

  try {
    const files = await generator(blog, blogDir, generatorConfig);
    logger.debug({ fileCount: files.length }, 'Generated files');
    
    // Clean up build dir and make again
    logger.debug({ path: BUILD_PATH }, 'Cleaning build directory');
    fs.removeSync(BUILD_PATH);
    fs.mkdirSync(BUILD_PATH);

    // Now write files given by the generator
    files.forEach((file: { name: string; content: string }) => {
      logger.debug({ file: file.name }, 'Writing file');
      fs.outputFileSync(`${BUILD_PATH}/${file.name}`, file.content, 'utf8');
    });
    logger.info({ fileCount: files.length }, 'Build completed successfully');
  } catch (error) {
    logger.error({ error }, 'Build process failed');
  }
};

const getBlog = (file: string) => {
  try {
    const blogPath = path.resolve(file);
    logger.debug({ path: blogPath }, 'Loading blog configuration');
    const data = fs.readFileSync(blogPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading blog configuration:', error);
    logger.error({ error: error instanceof Error ? error.message : String(error), file }, 'Failed to load blog configuration');
    process.exit(1);
  }
};

const program = new Command();

program
  .name('jsonblog')
  .description('CLI tool for JsonBlog')
  .version('2.6.0');

program
  .command('init')
  .description('Create an example blog.json')
  .action(() => {
    const samplePath = path.join(__dirname, '..', 'samples', 'blog.json');
    const targetPath = path.join(process.cwd(), 'blog.json');
    fs.copyFileSync(samplePath, targetPath);
    logger.info('Created blog.json with example content');
  });

program
  .command('build')
  .description('Build the blog')
  .option('-g, --generator <name>', 'Generator to use (overridden by blog.json if specified)')
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const blog = getBlog(config);
    const generatorName = getGeneratorName(blog, options.generator);
    logger.info({ file: config, generator: generatorName }, 'Starting build command');
    const generator = await getGenerator(generatorName);
    await build(generator, blog);
  });

program
  .command('serve')
  .description('Serve the blog')
  .option('-p, --port <number>', 'Port to serve on', '3000')
  .action((options) => {
    const port = parseInt(options.port, 10);
    const app = express();
    app.use(express.static(BUILD_PATH));
    app.listen(port, () => {
      logger.info({ port }, 'Serving blog at http://localhost:${port}');
    });
  });

program
  .command('watch')
  .description('Watch for changes and rebuild')
  .option('-g, --generator <name>', 'Generator to use (overridden by blog.json if specified)')
  .argument('[config]', 'Path to blog config file', 'blog.json')
  .action(async (config, options) => {
    const blog = getBlog(config);
    const generatorName = getGeneratorName(blog, options.generator);
    logger.info({ file: config, generator: generatorName }, 'Starting watch command');

    const watcher = chokidar.watch([config, 'content/**/*', 'templates/**/*'], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    logger.info(`Watching ${config} and content directory for changes...`);

    watcher.on('change', async (path) => {
      logger.info({ path }, 'File change detected');
      const blog = getBlog(config);
      const generatorName = getGeneratorName(blog, options.generator);
      const generator = await getGenerator(generatorName);
      await build(generator, blog);
      logger.info('Rebuild completed');
    });
  });

program.parse();
