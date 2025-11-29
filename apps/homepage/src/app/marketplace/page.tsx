import { getGeneratorRegistry } from '@/lib/generators';
import { enrichGeneratorWithStats } from '@/lib/npm-stats';
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Generator Marketplace - JSONBlog',
  description: 'Discover and preview JSONBlog generators for your static blog',
};

export default async function MarketplacePage() {
  const registry = getGeneratorRegistry();

  // Enrich generators with npm stats at build time
  const generatorsWithStats = await Promise.all(
    registry.generators.map(enrichGeneratorWithStats)
  );

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Generator Marketplace</h1>
          <p className="text-lg text-secondary max-w-2xl">
            Discover and preview JSONBlog generators. Each generator brings its own unique design
            and features to your blog.
          </p>
        </div>
      </div>

      {/* Marketplace Grid */}
      <MarketplaceGrid
        generators={generatorsWithStats}
        tags={registry.tags}
        categories={registry.categories}
      />
    </div>
  );
}
