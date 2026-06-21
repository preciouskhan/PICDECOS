import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

type Post = {
  id: string; title: string; slug: string; body: string; excerpt: string | null;
  category: string; published: boolean; published_at: string; image_url: string | null;
};

const empty: Partial<Post> = { title: "", slug: "", body: "", excerpt: "", category: "milestone", published: true };

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function PostsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Post>) => {
      const payload = { ...p, slug: p.slug || slugify(p.title || "") };
      if (p.id) {
        const { error } = await supabase.from("posts").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-posts"] }); qc.invalidateQueries({ queryKey: ["updates-all"] }); qc.invalidateQueries({ queryKey: ["home"] }); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-posts"] }); qc.invalidateQueries({ queryKey: ["updates-all"] }); qc.invalidateQueries({ queryKey: ["home"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl">Updates / News</h2>
        <button onClick={() => setEditing(empty)} className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wider">
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {editing && (
        <PostForm post={editing} onCancel={() => setEditing(null)} onSubmit={(p) => save.mutate(p)} busy={save.isPending} />
      )}

      <div className="space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 border border-border p-4">
            <div className="min-w-0">
              <p className="font-serif text-lg truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground">{new Date(p.published_at).toLocaleDateString()} · {p.category} {!p.published && "· (draft)"}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(p)} className="p-2 hover:text-brand"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => confirm("Delete this post?") && del.mutate(p.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>}
      </div>
    </div>
  );
}

function PostForm({ post, onCancel, onSubmit, busy }: { post: Partial<Post>; onCancel: () => void; onSubmit: (p: Partial<Post>) => void; busy: boolean }) {
  const [form, setForm] = useState<Partial<Post>>(post);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="border border-brand p-4 mb-6 space-y-3 bg-stone">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg">{post.id ? "Edit post" : "New post"}</h3>
        <button type="button" onClick={onCancel}><X className="h-4 w-4" /></button>
      </div>
      <Field label="Title" value={form.title || ""} onChange={(v) => setForm({ ...form, title: v })} required />
      <Field label="Excerpt (short summary)" value={form.excerpt || ""} onChange={(v) => setForm({ ...form, excerpt: v })} />
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Body</span>
        <textarea required rows={8} value={form.body || ""} onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
      </label>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</span>
          <select value={form.category || "milestone"} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm">
            <option value="milestone">Milestone</option>
            <option value="investment">Investment</option>
            <option value="partnership">Partnership</option>
            <option value="announcement">Announcement</option>
          </select>
        </label>
        <Field label="Slug (optional)" value={form.slug || ""} onChange={(v) => setForm({ ...form, slug: v })} />
        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <span className="text-sm">Published</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider">Cancel</button>
      </div>
    </form>
  );
}

export function Field({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
    </label>
  );
}
