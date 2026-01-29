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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
        {filters.map((filter) => (
          <div key={filter.name} className="w-full md:flex-1 md:min-w-[200px]">
            <label
              htmlFor={filter.name}
              className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
            >
              {filter.label}
            </label>
            <select
              id={filter.name}
              value={selectedFilters[filter.name] || ''}
              onChange={(e) => handleFilterChange(filter.name, e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0077d2] focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat pr-10"
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
          className="w-full md:w-auto px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
