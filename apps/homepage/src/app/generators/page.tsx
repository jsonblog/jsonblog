import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function GeneratorsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Generators</h1>
        <p className="text-secondary mb-12">
          Generators are the engines that transform your blog.json into beautiful static websites.
          Use our official generator or create your own.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Official Generator</h2>

          <div className="border border-gray-200 rounded p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">@jsonblog/generator-boilerplate</h3>
                <p className="text-secondary">
                  A clean, minimal reference implementation with IBM Plex Mono typography.
                </p>
              </div>
              <a
                href="https://www.npmjs.com/package/@jsonblog/generator-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm"
              >
                npm →
              </a>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="space-y-1 text-secondary text-sm">
                <li>• Responsive design with mobile-first approach</li>
                <li>• IBM Plex Mono monospace typography</li>
                <li>• Support for tags and categories</li>
                <li>• RSS feed generation</li>
                <li>• Markdown content rendering</li>
                <li>• AI-generated post indicators</li>
                <li>• Fast static HTML output</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm mb-2 font-semibold">Installation</p>
              <code className="text-sm">npm install -g @jsonblog/generator-boilerplate</code>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Creating Custom Generators</h2>
          <p className="text-secondary mb-6">
            Build your own generator to completely customize your blog&apos;s appearance and functionality.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">1. Create a Generator Package</h3>
              <p className="text-secondary text-sm mb-2">
                A generator is a Node.js module that exports a function accepting blog data and options:
              </p>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import type { BlogData } from '@jsonblog/schema';

export async function generate(
  data: BlogData,
  options: { outputDir: string }
): Promise<void> {
  // Transform blog.json into HTML files
  // Write to options.outputDir
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">2. Use Any Template Engine</h3>
              <p className="text-secondary text-sm mb-2">
                Choose your favorite templating solution:
              </p>
              <ul className="space-y-1 text-secondary text-sm">
                <li>• Handlebars (used in boilerplate)</li>
                <li>• EJS</li>
                <li>• Pug</li>
                <li>• React with SSG</li>
                <li>• Plain JavaScript template literals</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">3. Register Your Generator</h3>
              <p className="text-secondary text-sm mb-2">
                Publish to npm and install globally:
              </p>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <code className="text-sm">npm install -g your-jsonblog-generator</code>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Community Generators</h2>
          <p className="text-secondary mb-4">
            More generators coming soon! Building one? Let us know on GitHub.
          </p>
          <a
            href="https://github.com/ajaxdavis/jsonblog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all"
          >
            Contribute on GitHub
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
