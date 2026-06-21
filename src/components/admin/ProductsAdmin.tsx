import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Field } from "./PostsAdmin";

type Product = { id: string; name: string; category: string; description: string | null; unit: string | null; display_order: number };

export function ProductsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("display_order");
      if (error) throw error;
      return data as Product[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products-all"] });
    qc.invalidateQueries({ queryKey: ["home"] });
  };

  const save = useMutation({
    mutationFn: async (p: Partial<Product>) => {
      if (p.id) { const { error } = await supabase.from("products").update(p).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("products").insert(p as any); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); invalidate(); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Products</h2>
        <button onClick={() => setEditing({ category: "Poultry", display_order: data.length })} className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wider">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>
      {editing && (
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="border border-brand p-4 mb-6 space-y-3 bg-stone">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg">{editing.id ? "Edit product" : "New product"}</h3>
            <button type="button" onClick={() => setEditing(null)}><X className="h-4 w-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Name" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} required />
            <Field label="Category" value={editing.category || ""} onChange={(v) => setEditing({ ...editing, category: v })} required />
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</span>
            <textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Unit (e.g. 5kg bag)" value={editing.unit || ""} onChange={(v) => setEditing({ ...editing, unit: v })} />
            <Field label="Order" type="number" value={String(editing.display_order ?? 0)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={save.isPending} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">{save.isPending ? "Saving…" : "Save"}</button>
            <button type="button" onClick={() => setEditing(null)} className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-2">
        {data.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 border border-border p-4">
            <div className="min-w-0">
              <p className="font-serif text-lg truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.category}{p.unit && ` · ${p.unit}`}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(p)} className="p-2 hover:text-brand"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => confirm("Delete this product?") && del.mutate(p.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No products yet.</p>}
      </div>
    </div>
  );
}
