import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Field } from "./PostsAdmin";

type Project = { id: string; name: string; slug: string; description: string; status: "planned" | "ongoing" | "completed"; started_at: string | null; display_order: number };

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function ProjectsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const { data = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("display_order");
      if (error) throw error;
      return data as Project[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
    qc.invalidateQueries({ queryKey: ["projects-all"] });
    qc.invalidateQueries({ queryKey: ["home"] });
  };

  const save = useMutation({
    mutationFn: async (p: Partial<Project>) => {
      const payload = { ...p, slug: p.slug || slugify(p.name || "") };
      if (p.id) { const { error } = await supabase.from("projects").update(payload).eq("id", p.id); if (error) throw error; }
      else { const { error } = await supabase.from("projects").insert(payload as any); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); invalidate(); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("projects").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Projects</h2>
        <button onClick={() => setEditing({ status: "planned", display_order: data.length })} className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wider">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>
      {editing && <ProjectForm project={editing} onCancel={() => setEditing(null)} onSubmit={(p) => save.mutate(p)} busy={save.isPending} />}
      <div className="space-y-2">
        {data.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 border border-border p-4">
            <div className="min-w-0">
              <p className="font-serif text-lg truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{p.status}{p.started_at && ` · started ${new Date(p.started_at).toLocaleDateString()}`}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(p)} className="p-2 hover:text-brand"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => confirm("Delete this project?") && del.mutate(p.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>}
      </div>
    </div>
  );
}

function ProjectForm({ project, onCancel, onSubmit, busy }: { project: Partial<Project>; onCancel: () => void; onSubmit: (p: Partial<Project>) => void; busy: boolean }) {
  const [f, setF] = useState<Partial<Project>>(project);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(f); }} className="border border-brand p-4 mb-6 space-y-3 bg-stone">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg">{project.id ? "Edit project" : "New project"}</h3>
        <button type="button" onClick={onCancel}><X className="h-4 w-4" /></button>
      </div>
      <Field label="Name" value={f.name || ""} onChange={(v) => setF({ ...f, name: v })} required />
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</span>
        <textarea rows={4} required value={f.description || ""} onChange={(e) => setF({ ...f, description: e.target.value })}
          className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
      </label>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
          <select value={f.status || "planned"} onChange={(e) => setF({ ...f, status: e.target.value as Project["status"] })}
            className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm">
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <Field label="Started" type="date" value={f.started_at || ""} onChange={(v) => setF({ ...f, started_at: v || null })} />
        <Field label="Order" type="number" value={String(f.display_order ?? 0)} onChange={(v) => setF({ ...f, display_order: Number(v) })} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onCancel} className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider">Cancel</button>
      </div>
    </form>
  );
}
