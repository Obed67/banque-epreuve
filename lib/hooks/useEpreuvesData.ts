"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Epreuve {
  id: string;
  titre: string;
  type: string;
  filiere: string;
  ue: string;
  annee: string;
  session: string | null;
  statut: string;
  created_at: string;
  file_path: string;
}

export function useEpreuvesData() {
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);
  const [filteredEpreuves, setFilteredEpreuves] = useState<Epreuve[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeType = (value: string) =>
    value
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  useEffect(() => {
    const fetchEpreuves = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("epreuves")
        .select("*")
        .eq("statut", "Validé")
        .order("created_at", { ascending: false });

      if (!error) {
        const onlyEpreuves = (data || []).filter(
          (item) => normalizeType(item.type) === "epreuve",
        );
        setEpreuves(onlyEpreuves);
        setFilteredEpreuves(onlyEpreuves);
      }
      setLoading(false);
    };

    fetchEpreuves();
  }, []);

  const filters = useMemo(
    () => [
      {
        label: "Filière",
        name: "filiere",
        options: Array.from(new Set(epreuves.map((e) => e.filiere))),
      },
      {
        label: "UE",
        name: "ue",
        options: Array.from(new Set(epreuves.map((e) => e.ue))),
      },
      {
        label: "Année",
        name: "annee",
        options: Array.from(new Set(epreuves.map((e) => e.annee))),
      },
      {
        label: "Session",
        name: "session",
        options: Array.from(
          new Set(epreuves.map((e) => e.session).filter(Boolean) as string[]),
        ),
      },
    ],
    [epreuves],
  );

  const applyFilters = (values: Record<string, string>) => {
    let filtered = [...epreuves];
    if (values.filiere)
      filtered = filtered.filter((e) => e.filiere === values.filiere);
    if (values.ue) filtered = filtered.filter((e) => e.ue === values.ue);
    if (values.annee)
      filtered = filtered.filter((e) => e.annee === values.annee);
    if (values.session)
      filtered = filtered.filter((e) => e.session === values.session);
    setFilteredEpreuves(filtered);
  };

  return { loading, filteredEpreuves, filters, applyFilters };
}
