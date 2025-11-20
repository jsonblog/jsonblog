export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center text-sm text-secondary">
          <p>© 2025 JSONBlog. MIT Licensed.</p>
          <div className="flex gap-6">
            <a
              href="https://www.npmjs.com/package/@jsonblog/cli"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              npm
            </a>
            <a
              href="https://github.com/ajaxdavis/jsonblog"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
