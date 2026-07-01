'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import AppSelect from '@/app/components/AppSelect';
import Button from '@/app/components/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const ALL_VALUE = '__all__';

type FilterConfig = {
  label: string;
  name: string;
  options: string[];
};

interface FilterBarProps {
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, string>) => void;
}

function FilterFields({
  filters,
  selectedFilters,
  onChange,
}: {
  filters: FilterConfig[];
  selectedFilters: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <>
      {filters.map((filter) => (
        <AppSelect
          key={filter.name}
          id={`filter-${filter.name}`}
          label={filter.label}
          labelVariant="filter"
          placeholder="Tous"
          value={selectedFilters[filter.name] || ALL_VALUE}
          onValueChange={(value) => onChange(filter.name, value)}
          options={[
            { value: ALL_VALUE, label: 'Tous' },
            ...filter.options.map((option) => ({ value: option, label: option })),
          ]}
          className="w-full min-w-0"
        />
      ))}
    </>
  );
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sheetOpen, setSheetOpen] = useState(false);

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

  const activeEntries = useMemo(
    () =>
      Object.entries(selectedFilters).map(([name, value]) => {
        const config = filters.find((f) => f.name === name);
        return {
          name,
          value,
          label: config?.label ?? name,
        };
      }),
    [filters, selectedFilters],
  );

  const hasActiveFilters = activeEntries.length > 0;
  const gridCols =
    filters.length <= 3
      ? 'lg:grid-cols-3'
      : filters.length <= 5
        ? 'lg:grid-cols-3 xl:grid-cols-5'
        : 'lg:grid-cols-3 xl:grid-cols-6';

  return (
    <>
      {/* Mobile : bouton + pastilles + panneau */}
      <div className="mb-6 space-y-3 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] shadow-sm transition-colors hover:border-[#0077d2]/30 hover:bg-blue-50/50 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#0077d2]" aria-hidden />
            Filtrer
            {hasActiveFilters && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0077d2] px-1.5 text-xs font-bold text-white">
                {activeEntries.length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
              aria-label="Réinitialiser les filtres"
            >
              Effacer
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activeEntries.map((entry) => (
              <button
                key={entry.name}
                type="button"
                onClick={() => handleFilterChange(entry.name, ALL_VALUE)}
                className="inline-flex max-w-[min(100%,14rem)] shrink-0 items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 py-1.5 pl-3 pr-2 text-left text-xs font-medium text-[#0077d2] transition-colors hover:bg-blue-100 cursor-pointer"
              >
                <span className="truncate">
                  {entry.label}&nbsp;: {entry.value}
                </span>
                <X className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              </button>
            ))}
          </div>
        )}

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[min(88vh,640px)] overflow-y-auto rounded-t-2xl px-4 pb-8 pt-6"
          >
            <SheetHeader className="mb-4 text-left">
              <SheetTitle className="text-lg font-bold text-[#0f172a]">
                Filtrer les documents
              </SheetTitle>
              <p className="text-sm font-normal text-gray-500">
                Affinez votre recherche par critère.
              </p>
            </SheetHeader>

            <div className="space-y-4">
              <FilterFields
                filters={filters}
                selectedFilters={selectedFilters}
                onChange={handleFilterChange}
              />
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-4">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  Tout effacer
                </Button>
              )}
              <Button
                type="button"
                className="w-full"
                onClick={() => setSheetOpen(false)}
              >
                Voir les résultats
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop : barre inline */}
      <div className="mb-8 hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:block md:p-5">
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
          <FilterFields
            filters={filters}
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </>
  );
}
