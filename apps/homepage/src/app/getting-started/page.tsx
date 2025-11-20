import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function GettingStartedPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Getting Started</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <p className="text-secondary mb-4">
            Install JSONBlog CLI globally using your preferred package manager:
          </p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
            <code className="text-sm">npm install -g @jsonblog/cli</code>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
            <code className="text-sm">pnpm add -g @jsonblog/cli</code>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <code className="text-sm">yarn global add @jsonblog/cli</code>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
          <ol className="space-y-6">
            <li>
              <div className="flex gap-3">
                <span className="font-semibold text-accent">1.</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Create a blog.json file</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{`{
  "site": {
    "title": "My Blog",
    "description": "My thoughts and ideas"
  },
  "basics": {
    "name": "Your Name"
  },
  "posts": [
    {
      "title": "Hello World",
      "content": "# Hello World\\n\\nThis is my first post!",
      "createdAt": "2025-01-20"
    }
  ]
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="flex gap-3">
                <span className="font-semibold text-accent">2.</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Build your blog</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <code className="text-sm">jsonblog build</code>
                  </div>
                  <p className="text-secondary mt-2 text-sm">
                    This generates your static site in the <code className="bg-gray-100 px-1 rounded">build/</code> directory.
                  </p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex gap-3">
                <span className="font-semibold text-accent">3.</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Preview locally</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <code className="text-sm">jsonblog serve</code>
                  </div>
                  <p className="text-secondary mt-2 text-sm">
                    Opens your blog at <code className="bg-gray-100 px-1 rounded">http://localhost:8080</code>
                  </p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex gap-3">
                <span className="font-semibold text-accent">4.</span>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Deploy</h3>
                  <p className="text-secondary mb-2">
                    Deploy the <code className="bg-gray-100 px-1 rounded">build/</code> directory to any static hosting service:
                  </p>
                  <ul className="space-y-1 text-secondary text-sm">
                    <li>• Netlify</li>
                    <li>• Vercel</li>
                    <li>• GitHub Pages</li>
                    <li>• Cloudflare Pages</li>
                    <li>• Any web server</li>
                  </ul>
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Development Mode</h2>
          <p className="text-secondary mb-4">
            For live development with auto-reload:
          </p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <code className="text-sm">jsonblog dev</code>
          </div>
          <p className="text-secondary mt-2 text-sm">
            This watches for changes to your blog.json and automatically rebuilds your site.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/schema"
              className="p-4 border border-gray-200 rounded hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">Learn the Schema</h3>
              <p className="text-secondary text-sm">
                Explore all available fields and options for blog.json
              </p>
            </a>
            <a
              href="/generators"
              className="p-4 border border-gray-200 rounded hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">Explore Generators</h3>
              <p className="text-secondary text-sm">
                Customize your blog with different templates and themes
              </p>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
