import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGeneratorBySlug, GENERATORS } from '@/lib/generators';
import { enrichGeneratorWithStats } from '@/lib/npm-stats';
import { InstallInstructions } from '@/components/marketplace/InstallInstructions';

export async function generateStaticParams() {
  return GENERATORS.map((gen) => ({
    slug: gen.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const generator = getGeneratorBySlug(slug);

  if (!generator) {
    return {
      title: 'Generator Not Found - JSONBlog',
    };
  }

  return {
    title: `${generator.displayName} Generator - JSONBlog`,
    description: generator.description,
  };
}

export default async function GeneratorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const generator = getGeneratorBySlug(slug);

  if (!generator) {
    notFound();
  }

  // Enrich with npm stats
  const enrichedGenerator = await enrichGeneratorWithStats(generator);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/marketplace"
            className="text-accent hover:underline mb-4 inline-block"
          >
            ← Back to Marketplace
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{enrichedGenerator.displayName}</h1>
              <p className="text-lg text-secondary mb-4">{enrichedGenerator.description}</p>

              <div className="flex gap-2 mb-4">
                {enrichedGenerator.type === 'official' && (
                  <span className="text-xs bg-accent text-white px-3 py-1 rounded">Official</span>
                )}
                {enrichedGenerator.status === 'beta' && (
                  <span className="text-xs bg-yellow-500 text-white px-3 py-1 rounded">Beta</span>
                )}
                {enrichedGenerator.status === 'experimental' && (
                  <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded">
                    Experimental
                  </span>
                )}
                <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded">
                  v{enrichedGenerator.version}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {enrichedGenerator.stats && (
            <div className="flex gap-6 text-sm text-secondary">
              {enrichedGenerator.stats.weeklyDownloads !== undefined && (
                <div>
                  <span className="font-semibold">
                    {enrichedGenerator.stats.weeklyDownloads.toLocaleString()}
                  </span>{' '}
                  downloads/week
                </div>
              )}
              {enrichedGenerator.stats.lastPublished && (
                <div>
                  Last published:{' '}
                  <span className="font-semibold">
                    {new Date(enrichedGenerator.stats.lastPublished).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshot */}
            {enrichedGenerator.screenshot && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src={enrichedGenerator.screenshot}
                    alt={`${enrichedGenerator.displayName} screenshot`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {enrichedGenerator.longDescription && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-secondary leading-relaxed">{enrichedGenerator.longDescription}</p>
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <ul className="space-y-2">
                {enrichedGenerator.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span className="text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Demo */}
            {enrichedGenerator.demoUrl && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold mb-4">Live Demo</h2>
                <a
                  href={enrichedGenerator.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-accent text-white py-3 px-6 rounded hover:bg-opacity-90 transition-colors"
                >
                  View Live Demo →
                </a>
                <p className="text-sm text-secondary mt-2">
                  Opens in new tab - See how your blog would look with this generator
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Installation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Installation</h3>
              <InstallInstructions
                packageName={enrichedGenerator.npmPackage}
                installCommand={enrichedGenerator.installCommand}
                usageExample={enrichedGenerator.usageExample}
              />
            </div>

            {/* Technical Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Technical Details</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold mb-1">Template Engine</dt>
                  <dd className="text-secondary">{enrichedGenerator.templateEngine}</dd>
                </div>
                {enrichedGenerator.cssFramework && (
                  <div>
                    <dt className="font-semibold mb-1">CSS Framework</dt>
                    <dd className="text-secondary">{enrichedGenerator.cssFramework}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-semibold mb-1">Package</dt>
                  <dd className="text-secondary break-all">{enrichedGenerator.npmPackage}</dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {enrichedGenerator.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {enrichedGenerator.categories.map((category) => (
                  <span
                    key={category}
                    className="text-xs bg-accent bg-opacity-10 text-accent px-3 py-1 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Links</h3>
              <div className="space-y-2">
                <a
                  href={enrichedGenerator.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-accent hover:underline"
                >
                  GitHub Repository →
                </a>
                <a
                  href={`https://www.npmjs.com/package/${enrichedGenerator.npmPackage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-accent hover:underline"
                >
                  npm Package →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
