'use client';

import { useState } from 'react';

export interface FilterState {
  search: string;
  selectedTags: string[];
  selectedCategories: string[];
}

interface FilterSidebarProps {
  tags: string[];
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({ tags, categories, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedTags: [],
    selectedCategories: [],
  });

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    updateFilters({ selectedTags: newTags });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    updateFilters({ selectedCategories: newCategories });
  };

  const clearFilters = () => {
    updateFilters({
      search: '',
      selectedTags: [],
      selectedCategories: [],
    });
  };

  const hasActiveFilters =
    filters.search || filters.selectedTags.length > 0 || filters.selectedCategories.length > 0;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto">
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Search</label>
        <input
          type="text"
          placeholder="Search generators..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent"
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Tags</label>
          <div className="space-y-2">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                  className="mr-2 cursor-pointer"
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Categories</label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="mr-2 cursor-pointer"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-accent hover:underline w-full text-left"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}
