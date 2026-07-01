"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { GRID_PAGE_SIZE, getTotalPages } from "@/lib/pagination";

export const CATALOG_DOCUMENT_COLUMNS =
  "id,titre,type,etablissement,filiere,ue,annee,niveau,session,file_path,original_file_name,created_at";

export type CatalogDocument = {
  id: string;
  titre: string;
  type: string;
  etablissement: string;
  filiere: string;
  ue: string;
  annee: string;
  niveau: string;
  session: string | null;
  file_path: string;
  original_file_name?: string | null;
  created_at: string;
};

type RefRow = { label: string; is_active?: boolean; sort_order?: number | null };

const SESSION_OPTIONS = ["Normale", "Rattrapage"];

type CatalogMode = "epreuves" | "ressources";

function sortLabels(rows: RefRow[]) {
  return rows
    .filter((row) => row.label && row.is_active !== false)
    .sort(
      (a, b) =>
        (a.sort_order ?? 9999) - (b.sort_order ?? 9999) ||
        a.label.localeCompare(b.label),
    )
    .map((row) => row.label);
}

function buildBaseQuery(mode: CatalogMode) {
  let query = supabase
    .from("epreuves")
    .select(CATALOG_DOCUMENT_COLUMNS, { count: "exact" })
    .eq("statut", "Validé");

  if (mode === "epreuves") {
    return query.ilike("type", "epreuve");
  }

  return query.not("type", "ilike", "epreuve");
}

export function useCatalogDocuments(mode: CatalogMode) {
  const [documents, setDocuments] = useState<CatalogDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    etablissements: string[];
    filieres: string[];
    ues: string[];
    annees: string[];
    niveaux: string[];
    types: string[];
    sessions: string[];
  }>({
    etablissements: [],
    filieres: [],
    ues: [],
    annees: [],
    niveaux: [],
    types: [],
    sessions: SESSION_OPTIONS,
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      const [
        etablissementsRes,
        filieresRes,
        uesRes,
        anneesRes,
        niveauxRes,
        typesRes,
      ] = await Promise.all([
        supabase.from("etablissements").select("label,is_active,sort_order"),
        supabase.from("filieres").select("label,is_active,sort_order"),
        supabase.from("ues").select("label,is_active,sort_order"),
        supabase.from("annees").select("label,is_active,sort_order"),
        supabase.from("niveaux").select("label,is_active,sort_order"),
        supabase.from("document_types").select("label,is_active,sort_order"),
      ]);

      const types = sortLabels((typesRes.data || []) as RefRow[]).filter(
        (label) => label.toLowerCase() !== "epreuve",
      );

      setFilterOptions({
        etablissements: sortLabels((etablissementsRes.data || []) as RefRow[]),
        filieres: sortLabels((filieresRes.data || []) as RefRow[]),
        ues: sortLabels((uesRes.data || []) as RefRow[]),
        annees: sortLabels((anneesRes.data || []) as RefRow[]),
        niveaux: sortLabels((niveauxRes.data || []) as RefRow[]),
        types,
        sessions: SESSION_OPTIONS,
      });
    };

    void loadFilterOptions();
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * GRID_PAGE_SIZE;
    const to = from + GRID_PAGE_SIZE - 1;

    let query = buildBaseQuery(mode);

    if (activeFilters.etablissement) {
      query = query.eq("etablissement", activeFilters.etablissement);
    }
    if (activeFilters.filiere) {
      query = query.eq("filiere", activeFilters.filiere);
    }
    if (activeFilters.ue) {
      query = query.eq("ue", activeFilters.ue);
    }
    if (activeFilters.annee) {
      query = query.eq("annee", activeFilters.annee);
    }
    if (activeFilters.niveau) {
      query = query.eq("niveau", activeFilters.niveau);
    }
    if (activeFilters.session) {
      query = query.eq("session", activeFilters.session);
    }
    if (activeFilters.type) {
      query = query.eq("type", activeFilters.type);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error) {
      setDocuments((data || []) as CatalogDocument[]);
      setTotalCount(count ?? 0);
    }

    setLoading(false);
  }, [activeFilters, mode, page]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  const filters = useMemo(() => {
    if (mode === "epreuves") {
      return [
        {
          label: "Établissement",
          name: "etablissement",
          options: filterOptions.etablissements,
        },
        { label: "Filière", name: "filiere", options: filterOptions.filieres },
        { label: "UE", name: "ue", options: filterOptions.ues },
        { label: "Année", name: "annee", options: filterOptions.annees },
        { label: "Niveau", name: "niveau", options: filterOptions.niveaux },
        { label: "Session", name: "session", options: filterOptions.sessions },
      ];
    }

    return [
      { label: "Type", name: "type", options: filterOptions.types },
      {
        label: "Établissement",
        name: "etablissement",
        options: filterOptions.etablissements,
      },
      { label: "Filière", name: "filiere", options: filterOptions.filieres },
      { label: "Année", name: "annee", options: filterOptions.annees },
      { label: "Niveau", name: "niveau", options: filterOptions.niveaux },
    ];
  }, [filterOptions, mode]);

  const applyFilters = (values: Record<string, string>) => {
    setActiveFilters(values);
    setPage(1);
  };

  const totalPages = getTotalPages(totalCount, GRID_PAGE_SIZE);
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * GRID_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * GRID_PAGE_SIZE, totalCount);

  return {
    documents,
    loading,
    filters,
    applyFilters,
    page,
    setPage,
    totalCount,
    totalPages,
    rangeStart,
    rangeEnd,
  };
}
