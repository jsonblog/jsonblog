import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold hover:text-accent transition-colors">
            JSONBlog
          </Link>
          <nav className="flex gap-6">
            <Link href="/getting-started" className="text-secondary hover:text-primary transition-colors">
              Getting Started
            </Link>
            <Link href="/marketplace" className="text-secondary hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link href="/generators" className="text-secondary hover:text-primary transition-colors">
              Generators
            </Link>
            <Link href="/schema" className="text-secondary hover:text-primary transition-colors">
              Schema
            </Link>
            <Link href="/changelog" className="text-secondary hover:text-primary transition-colors">
              Changelog
            </Link>
            <a
              href="https://github.com/ajaxdavis/jsonblog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
