'use client';

import { useState } from 'react';

interface FilterBarProps {
  filters: {
    label: string;
    name: string;
    options: string[];
  }[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...selectedFilters, [name]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {filters.map((filter) => (
          <div key={filter.name} className="flex-1 min-w-[200px]">
            <label
              htmlFor={filter.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {filter.label}
            </label>
            <select
              id={filter.name}
              value={selectedFilters[filter.name] || ''}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent"
            >
              <option value="">Tous</option>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
