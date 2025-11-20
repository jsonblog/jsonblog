import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SchemaPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Schema Reference</h1>
        <p className="text-secondary mb-12">
          Complete reference for the blog.json file structure. All fields are optional unless marked as required.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Root Structure</h2>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto mb-4">
            <pre className="text-sm">
              <code>{`{
  "site": { ... },      // Site metadata (required)
  "basics": { ... },    // Author information
  "posts": [ ... ],     // Blog posts
  "pages": [ ... ]      // Static pages
}`}</code>
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">site (required)</h2>
          <p className="text-secondary mb-4">Core website metadata.</p>
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Field</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3"><code>title</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Your blog&apos;s title</td>
                </tr>
                <tr>
                  <td className="p-3"><code>description</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Brief description for meta tags</td>
                </tr>
                <tr>
                  <td className="p-3"><code>url</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Full URL (e.g., https://blog.example.com)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">basics</h2>
          <p className="text-secondary mb-4">Information about the author.</p>
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Field</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3"><code>name</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Author&apos;s name</td>
                </tr>
                <tr>
                  <td className="p-3"><code>email</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Contact email</td>
                </tr>
                <tr>
                  <td className="p-3"><code>url</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Personal website or portfolio</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">posts</h2>
          <p className="text-secondary mb-4">Array of blog post objects.</p>
          <div className="border border-gray-200 rounded overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Field</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3"><code>title</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Post title</td>
                </tr>
                <tr>
                  <td className="p-3"><code>content</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Markdown content</td>
                </tr>
                <tr>
                  <td className="p-3"><code>description</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Short summary for listings</td>
                </tr>
                <tr>
                  <td className="p-3"><code>createdAt</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Date in YYYY-MM-DD format</td>
                </tr>
                <tr>
                  <td className="p-3"><code>updatedAt</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Last updated date</td>
                </tr>
                <tr>
                  <td className="p-3"><code>tags</code></td>
                  <td className="p-3 text-secondary">string[]</td>
                  <td className="p-3 text-secondary">Array of tag names</td>
                </tr>
                <tr>
                  <td className="p-3"><code>categories</code></td>
                  <td className="p-3 text-secondary">string[]</td>
                  <td className="p-3 text-secondary">Array of category names</td>
                </tr>
                <tr>
                  <td className="p-3"><code>type</code></td>
                  <td className="p-3 text-secondary">&apos;ai&apos; | &apos;human&apos;</td>
                  <td className="p-3 text-secondary">Mark AI-generated posts</td>
                </tr>
                <tr>
                  <td className="p-3"><code>slug</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Custom URL slug (auto-generated if omitted)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-sm">
              <code>{`{
  "posts": [
    {
      "title": "My First Post",
      "content": "# Hello\\n\\nThis is my first post!",
      "description": "An introduction to my blog",
      "createdAt": "2025-01-20",
      "tags": ["intro", "welcome"],
      "categories": ["Meta"],
      "type": "human"
    }
  ]
}`}</code>
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">pages</h2>
          <p className="text-secondary mb-4">Array of static page objects (About, Contact, etc.).</p>
          <div className="border border-gray-200 rounded overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Field</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3"><code>title</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Page title</td>
                </tr>
                <tr>
                  <td className="p-3"><code>content</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Markdown content</td>
                </tr>
                <tr>
                  <td className="p-3"><code>slug</code></td>
                  <td className="p-3 text-secondary">string</td>
                  <td className="p-3 text-secondary">Custom URL slug (auto-generated if omitted)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Complete Example</h2>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-sm">
              <code>{`{
  "site": {
    "title": "Jane's Dev Blog",
    "description": "Thoughts on web development and design",
    "url": "https://janedoe.dev"
  },
  "basics": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "url": "https://janedoe.com"
  },
  "posts": [
    {
      "title": "Building with TypeScript",
      "content": "# TypeScript Best Practices\\n\\n...",
      "description": "Tips for writing better TypeScript",
      "createdAt": "2025-01-15",
      "tags": ["typescript", "javascript"],
      "categories": ["Development"]
    },
    {
      "title": "AI-Generated Weekly Summary",
      "content": "# This Week in Tech\\n\\n...",
      "type": "ai",
      "createdAt": "2025-01-20"
    }
  ],
  "pages": [
    {
      "title": "About",
      "content": "# About Me\\n\\nI'm a web developer..."
    }
  ]
}`}</code>
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Validation</h2>
          <p className="text-secondary mb-4">
            The <code className="bg-gray-100 px-1 rounded">@jsonblog/schema</code> package provides validation using JSON Schema and Zod.
          </p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <code className="text-sm">npm install @jsonblog/schema</code>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
