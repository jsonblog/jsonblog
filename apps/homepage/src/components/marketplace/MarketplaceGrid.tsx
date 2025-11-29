'use client';

import { useState } from 'react';
import type { GeneratorMetadata } from '@/lib/generators';
import { GeneratorCard } from './GeneratorCard';
import { FilterSidebar, type FilterState } from './FilterSidebar';

interface MarketplaceGridProps {
  generators: GeneratorMetadata[];
  tags: string[];
  categories: string[];
}

export function MarketplaceGrid({ generators, tags, categories }: MarketplaceGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedTags: [],
    selectedCategories: [],
  });

  const filteredGenerators = generators.filter((gen) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        gen.name.toLowerCase().includes(searchLower) ||
        gen.displayName.toLowerCase().includes(searchLower) ||
        gen.description.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }
    }

    // Tag filter
    if (filters.selectedTags.length > 0) {
      const hasMatchingTag = filters.selectedTags.some((tag) => gen.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Category filter
    if (filters.selectedCategories.length > 0) {
      const hasMatchingCategory = filters.selectedCategories.some((cat) =>
        gen.categories.includes(cat)
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="flex">
      <FilterSidebar tags={tags} categories={categories} onFilterChange={setFilters} />
      <div className="flex-1 p-6">
        {filteredGenerators.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary text-lg">
              No generators match your filters. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGenerators.map((gen) => (
              <GeneratorCard key={gen.id} generator={gen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
