import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, FileText } from "lucide-react";

type Doc = { id: string; title: string; description: string | null; file_path: string; file_size_bytes: number | null; created_at: string };

export function DocumentsAdmin() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const { data = [] } = useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Doc[];
    },
  });

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) { toast.error("Title and file are required"); return; }
    setBusy(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("site-documents").upload(path, file);
    if (upErr) { setBusy(false); return toast.error(upErr.message); }
    const { error } = await supabase.from("documents").insert({
      title: title.trim(),
      description: description.trim() || null,
      file_path: path,
      file_size_bytes: file.size,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Uploaded");
    setTitle(""); setDescription(""); setFile(null);
    qc.invalidateQueries({ queryKey: ["admin-documents"] });
    qc.invalidateQueries({ queryKey: ["documents-all"] });
  }

  const del = useMutation({
    mutationFn: async (doc: Doc) => {
      await supabase.storage.from("site-documents").remove([doc.file_path]);
      const { error } = await supabase.from("documents").delete().eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-documents"] }); qc.invalidateQueries({ queryKey: ["documents-all"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Documents</h2>
      <form onSubmit={upload} className="border border-border p-4 mb-6 space-y-3 bg-stone">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">File (PDF, etc.)</span>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required className="mt-1.5 block w-full text-sm" />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description (optional)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">
          <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload"}
        </button>
      </form>

      <div className="space-y-2">
        {data.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between gap-4 border border-border p-4">
            <div className="flex gap-3 items-center min-w-0">
              <FileText className="h-5 w-5 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="font-serif text-lg truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground truncate">{doc.file_path}</p>
              </div>
            </div>
            <button onClick={() => confirm("Delete this document?") && del.mutate(doc)} className="p-2 hover:text-destructive shrink-0"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No documents yet.</p>}
      </div>
    </div>
  );
}
