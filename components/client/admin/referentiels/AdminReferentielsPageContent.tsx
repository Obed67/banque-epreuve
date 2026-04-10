"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, Search } from "lucide-react";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";

type RefTable = "document_types" | "filieres" | "ues" | "annees";

type RefItem = {
  id: string;
  code: string;
  label: string;
  is_active: boolean;
  sort_order: number | null;
};

const TABLE_CONFIG: { table: RefTable; title: string }[] = [
  { table: "document_types", title: "Types de document" },
  { table: "filieres", title: "Filières" },
  { table: "ues", title: "UE" },
  { table: "annees", title: "Années" },
];

function createTableRecord<T>(factory: () => T): Record<RefTable, T> {
  return {
    document_types: factory(),
    filieres: factory(),
    ues: factory(),
    annees: factory(),
  };
}

function toCode(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function AdminReferentielsPageContent() {
  const { userEmail, checkingAuth, logout } = useAdminAuth();
  const [data, setData] = useState<Record<RefTable, RefItem[]>>(() =>
    createTableRecord(() => []),
  );
  const [loading, setLoading] = useState(true);
  const [newValues, setNewValues] = useState<Record<RefTable, string>>(() =>
    createTableRecord(() => ""),
  );
  const [searchByTable, setSearchByTable] = useState<Record<RefTable, string>>(
    () => createTableRecord(() => ""),
  );
  const [sortDraftByTable, setSortDraftByTable] = useState<
    Record<RefTable, Record<string, string>>
  >({
    document_types: {},
    filieres: {},
    ues: {},
    annees: {},
  });
  const [dragging, setDragging] = useState<{
    table: RefTable;
    itemId: string;
  } | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const results = await Promise.all(
      TABLE_CONFIG.map(async ({ table }) => {
        const { data, error } = await supabase
          .from(table)
          .select("id,code,label,is_active,sort_order")
          .order("sort_order", { ascending: true, nullsFirst: false })
          .order("label", { ascending: true });
        return { table, data: error ? [] : (data as RefItem[]) };
      }),
    );

    const next = createTableRecord<RefItem[]>(() => []);
    for (const res of results) next[res.table] = res.data;
    setData(next);
    setLoading(false);
  };

  useEffect(() => {
    if (checkingAuth) return;
    fetchAll();
  }, [checkingAuth]);

  const notify = (type: "success" | "error", text: string) => {
    toast({
      title: type === "success" ? "Succès" : "Erreur",
      description: text,
      variant: type === "success" ? "default" : "destructive",
    });
  };

  const persistNormalizedOrder = async (
    table: RefTable,
    orderedItems: RefItem[],
    successMessage = "Ordre mis à jour.",
  ) => {
    const normalized = orderedItems.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    setData((prev) => ({ ...prev, [table]: normalized }));

    // Use safe temporary values within PostgreSQL int range to avoid unique conflicts.
    const tempBase = -1000000 - normalized.length;

    for (let index = 0; index < normalized.length; index += 1) {
      const item = normalized[index];
      const { data: updatedRows, error } = await supabase
        .from(table)
        .update({ sort_order: tempBase - index })
        .select("id")
        .eq("id", item.id);

      if (error || !updatedRows?.length) {
        notify("error", "Réorganisation impossible.");
        await fetchAll();
        return false;
      }
    }

    for (const item of normalized) {
      const { data: updatedRows, error } = await supabase
        .from(table)
        .update({ sort_order: item.sort_order })
        .select("id")
        .eq("id", item.id);

      if (error || !updatedRows?.length) {
        notify("error", "Réorganisation impossible.");
        await fetchAll();
        return false;
      }
    }

    await fetchAll();

    notify("success", successMessage);
    return true;
  };

  const addValue = async (table: RefTable) => {
    const label = newValues[table].trim();
    if (!label) return;

    const nextSortOrder =
      data[table].reduce(
        (max, item) => Math.max(max, item.sort_order ?? 0),
        0,
      ) + 1;

    const { data: inserted, error } = await supabase
      .from(table)
      .insert({
        code: toCode(label),
        label,
        is_active: true,
        sort_order: nextSortOrder,
      })
      .select("id,code,label,is_active,sort_order")
      .single();

    if (error) {
      if (error.code === "23505") {
        notify("error", "Cet élément existe déjà.");
        return;
      }
      notify("error", "Impossible d'ajouter cet élément.");
      return;
    }

    if (inserted) {
      setData((prev) => ({
        ...prev,
        [table]: [...prev[table], inserted as RefItem],
      }));
    }

    setNewValues((prev) => ({ ...prev, [table]: "" }));
    notify("success", "Élément ajouté.");
  };

  const updateItem = async (
    table: RefTable,
    item: RefItem,
    patch: Partial<RefItem>,
  ) => {
    const previousRows = data[table];

    setData((prev) => ({
      ...prev,
      [table]: prev[table].map((row) =>
        row.id === item.id ? { ...row, ...patch } : row,
      ),
    }));

    const { data: updatedRows, error } = await supabase
      .from(table)
      .update(patch)
      .select("id")
      .eq("id", item.id);

    if (error || !updatedRows?.length) {
      setData((prev) => ({ ...prev, [table]: previousRows }));
      notify("error", "Mise à jour impossible.");
      return;
    }
  };

  const reorderItems = async (
    table: RefTable,
    draggedId: string,
    targetId: string,
  ) => {
    const current = data[table];
    const fromIndex = current.findIndex((item) => item.id === draggedId);
    const toIndex = current.findIndex((item) => item.id === targetId);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return;
    }

    const reordered = [...current];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    await persistNormalizedOrder(table, reordered);
  };

  const moveItemToPosition = async (
    table: RefTable,
    itemId: string,
    targetPosition: number,
  ) => {
    const current = [...data[table]];
    const fromIndex = current.findIndex((item) => item.id === itemId);
    if (fromIndex < 0) return;

    const safeTarget = Math.min(
      Math.max(Math.trunc(targetPosition), 1),
      current.length,
    );
    const toIndex = safeTarget - 1;

    if (fromIndex === toIndex) return;

    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);

    await persistNormalizedOrder(table, current);
  };

  const getCurrentPosition = (table: RefTable, itemId: string) => {
    const position = data[table].findIndex((row) => row.id === itemId);
    return position >= 0 ? position + 1 : 1;
  };

  const resetSortDraft = (table: RefTable, itemId: string) => {
    const nextTableDraft = { ...sortDraftByTable[table] };
    delete nextTableDraft[itemId];

    setSortDraftByTable((prev) => ({
      ...prev,
      [table]: nextTableDraft,
    }));
  };

  const getFilteredItems = (table: RefTable) => {
    const searchTerm = searchByTable[table].trim().toLowerCase();
    if (!searchTerm) return data[table];
    return data[table].filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm),
    );
  };

  return (
    <div className="h-screen bg-[#eef6ff]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[290px_1fr]">
        <AdminSidebar userEmail={userEmail} onLogout={logout} />

        <section className="h-full overflow-y-auto p-6 lg:p-8">
          <Toaster />

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#0f172a]">
              Référentiels
            </h1>
            <p className="text-gray-500 mt-1">
              Gérez les options de soumission
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-blue-100 bg-white">
              <Loader
                message="Chargement des référentiels..."
                className="py-14"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {TABLE_CONFIG.map(({ table, title }) => (
                <div
                  key={table}
                  className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                >
                  {(() => {
                    const filteredItems = getFilteredItems(table);
                    return (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-bold text-[#0f172a]">
                            {title}
                          </h2>
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-[#0077d2] border border-blue-100">
                            {data[table].length} élément(s)
                          </span>
                        </div>

                        <div className="relative mb-3">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={searchByTable[table]}
                            onChange={(e) =>
                              setSearchByTable((prev) => ({
                                ...prev,
                                [table]: e.target.value,
                              }))
                            }
                            placeholder={`Rechercher dans ${title.toLowerCase()}`}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
                          />
                        </div>

                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newValues[table]}
                            onChange={(e) =>
                              setNewValues((prev) => ({
                                ...prev,
                                [table]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addValue(table);
                              }
                            }}
                            placeholder={`Ajouter un élément (${title.toLowerCase()})`}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
                          />
                          <Button
                            onClick={() => addValue(table)}
                            className="bg-[#0077d2] hover:bg-[#0062b0] text-white flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Ajouter
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {filteredItems.map((item) => (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.closest("input,button,label")) {
                                  e.preventDefault();
                                  return;
                                }
                                setDragging({ table, itemId: item.id });
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                              }}
                              onDrop={async (e) => {
                                e.preventDefault();
                                if (!dragging || dragging.table !== table)
                                  return;
                                await reorderItems(
                                  table,
                                  dragging.itemId,
                                  item.id,
                                );
                                setDragging(null);
                              }}
                              onDragEnd={() => setDragging(null)}
                              className={`grid grid-cols-1 md:grid-cols-[30px_1fr_120px_120px] gap-2 items-center rounded-lg border px-3 py-2 ${dragging?.itemId === item.id ? "border-[#0077d2] bg-blue-50/50" : "border-gray-100"}`}
                            >
                              <div className="flex justify-center text-gray-400 cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <input
                                type="text"
                                defaultValue={item.label}
                                onBlur={(e) => {
                                  const nextLabel = e.target.value.trim();
                                  if (nextLabel && nextLabel !== item.label) {
                                    updateItem(table, item, {
                                      label: nextLabel,
                                    });
                                  }
                                }}
                                className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
                              />

                              <input
                                type="number"
                                value={
                                  sortDraftByTable[table][item.id] ??
                                  String(getCurrentPosition(table, item.id))
                                }
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (/^\d*$/.test(raw)) {
                                    setSortDraftByTable((prev) => ({
                                      ...prev,
                                      [table]: {
                                        ...prev[table],
                                        [item.id]: raw,
                                      },
                                    }));
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                onBlur={async (e) => {
                                  const raw = e.target.value.trim();
                                  const nextSort = Number(raw);
                                  if (!raw || Number.isNaN(nextSort)) {
                                    resetSortDraft(table, item.id);
                                    return;
                                  }

                                  await moveItemToPosition(
                                    table,
                                    item.id,
                                    nextSort,
                                  );

                                  resetSortDraft(table, item.id);
                                }}
                                className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077d2]"
                              />

                              <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  draggable={false}
                                  checked={item.is_active}
                                  onChange={(e) =>
                                    updateItem(table, item, {
                                      is_active: e.target.checked,
                                    })
                                  }
                                />
                                Actif
                              </label>
                            </div>
                          ))}

                          {!filteredItems.length && (
                            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                              Aucun résultat pour cette recherche.
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
