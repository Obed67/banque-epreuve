'use client';

import { useState } from 'react';
import AppSelect from '@/app/components/AppSelect';

const ALL_VALUE = '__all__';

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
    const resolvedValue = value === ALL_VALUE ? '' : value;
    const newFilters = { ...selectedFilters, [name]: resolvedValue };
    if (!resolvedValue) {
      delete newFilters[name];
    }
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
        {filters.map((filter) => (
          <AppSelect
            key={filter.name}
            id={filter.name}
            label={filter.label}
            labelVariant="filter"
            placeholder="Tous"
            value={selectedFilters[filter.name] || ALL_VALUE}
            onValueChange={(value) => handleFilterChange(filter.name, value)}
            options={[
              { value: ALL_VALUE, label: 'Tous' },
              ...filter.options.map((option) => ({ value: option, label: option })),
            ]}
            className="w-full md:flex-1 md:min-w-[200px]"
          />
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full md:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}
