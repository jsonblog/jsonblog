import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getChangelogs } from '@/lib/changelog';

export default function ChangelogPage() {
  const changelogs = getChangelogs();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Changelog</h1>
        <p className="text-secondary mb-12">
          All notable changes to JSONBlog packages are documented here.
        </p>

        {changelogs.map((changelog) => (
          <section key={changelog.packageName} className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">
              {changelog.displayName}
            </h2>

            {changelog.entries.length === 0 ? (
              <p className="text-secondary italic">No changelog entries available.</p>
            ) : (
              <div className="space-y-8">
                {changelog.entries.map((entry) => (
                  <div key={entry.version} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex items-baseline gap-3 mb-3">
                      <h3 className="text-xl font-semibold">v{entry.version}</h3>
                      <time className="text-sm text-secondary">{entry.date}</time>
                    </div>
                    <ul className="space-y-2">
                      {entry.changes.map((change, idx) => (
                        <li key={idx} className="text-secondary flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
