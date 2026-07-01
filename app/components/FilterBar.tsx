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
  const gridCols =
    filters.length <= 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : filters.length <= 5
        ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
        : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';

  return (
    <div className="mb-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <p className="text-sm font-semibold text-[#0f172a]">Filtrer les documents</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      <div className={['grid grid-cols-1 gap-3', gridCols].join(' ')}>
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
            className="w-full min-w-0"
          />
        ))}
      </div>
    </div>
  );
}
