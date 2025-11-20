import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Create a Blog with Just JSON
          </h1>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            JSONBlog is a simple, powerful static blog generator. Write your content in a single JSON file,
            run one command, and get a beautiful, fast blog.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/getting-started"
              className="bg-primary text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/ajaxdavis/jsonblog"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 px-6 py-3 rounded hover:border-primary transition-all"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded">
            <h3 className="text-xl font-semibold mb-3">Simple Setup</h3>
            <p className="text-secondary">
              No complex configuration. Just create a blog.json file and run jsonblog build.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded">
            <h3 className="text-xl font-semibold mb-3">Fast & Lightweight</h3>
            <p className="text-secondary">
              Static HTML output means blazing fast load times and no server required.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded">
            <h3 className="text-xl font-semibold mb-3">Fully Customizable</h3>
            <p className="text-secondary">
              Use our default generator or create your own with custom templates and styling.
            </p>
          </div>
        </section>

        {/* Quick Example */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Example</h2>
          <div className="bg-gray-50 p-6 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-sm">
              <code>{`{
  "site": {
    "title": "My Awesome Blog",
    "description": "Thoughts on code, design, and life"
  },
  "basics": {
    "name": "Jane Developer"
  },
  "posts": [
    {
      "title": "My First Post",
      "content": "# Hello World\\n\\nWelcome to my blog!",
      "createdAt": "2025-01-20"
    }
  ]
}`}</code>
            </pre>
          </div>
          <p className="text-center mt-6 text-secondary">
            Run <code className="bg-gray-100 px-2 py-1 rounded">jsonblog build</code> and your blog is ready!
          </p>
        </section>

        {/* Packages */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Available Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded">
              <h3 className="text-lg font-semibold mb-2">@jsonblog/cli</h3>
              <p className="text-sm text-secondary mb-4">
                Command-line interface for building and serving your blog
              </p>
              <a
                href="https://www.npmjs.com/package/@jsonblog/cli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm"
              >
                View on npm →
              </a>
            </div>
            <div className="p-6 border border-gray-200 rounded">
              <h3 className="text-lg font-semibold mb-2">@jsonblog/schema</h3>
              <p className="text-sm text-secondary mb-4">
                JSON Schema definition and validation for blog.json files
              </p>
              <a
                href="https://www.npmjs.com/package/@jsonblog/schema"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm"
              >
                View on npm →
              </a>
            </div>
            <div className="p-6 border border-gray-200 rounded">
              <h3 className="text-lg font-semibold mb-2">@jsonblog/generator-boilerplate</h3>
              <p className="text-sm text-secondary mb-4">
                Reference implementation and starter generator
              </p>
              <a
                href="https://www.npmjs.com/package/@jsonblog/generator-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm"
              >
                View on npm →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
