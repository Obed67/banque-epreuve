"use client";

import SearchInput from "@/app/components/SearchInput";

type CatalogSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function CatalogSearchBar({
  value,
  onChange,
  placeholder = "Rechercher (titre, filière, UE…) — sans accent requis",
}: CatalogSearchBarProps) {
  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
      <label htmlFor="catalog-search" className="mb-2 block text-sm font-semibold text-[#0f172a]">
        Recherche
      </label>
      <SearchInput
        id="catalog-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
