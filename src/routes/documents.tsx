import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";

const documentsQuery = queryOptions({
  queryKey: ["documents-all"],
  queryFn: async () => {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    return data ?? [];
  },
});

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — PICDECOS" },
      { name: "description", content: "Annual reports, General Assembly speeches, brochures, and the PICDECOS registration certificate." },
      { property: "og:title", content: "PICDECOS Documents" },
      { property: "og:description", content: "Annual reports, GA speeches, and official records." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(documentsQuery),
  component: Documents,
  errorComponent: ({ error }) => <div className="p-8" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Documents() {
  const { data: documents } = useSuspenseQuery(documentsQuery);
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Documents</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">Records & reports.</h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
            Annual reports, General Assembly speeches, brochures, and registration documents.
          </p>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
          {documents.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No documents uploaded yet.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function DocumentRow({ doc }: { doc: { id: string; title: string; description: string | null; file_path: string; file_size_bytes: number | null } }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from("site-documents").createSignedUrl(doc.file_path, 60 * 60).then(({ data }) => {
      setUrl(data?.signedUrl ?? null);
    });
  }, [doc.file_path]);
  return (
    <a
      href={url ?? "#"}
      target="_blank"
      rel="noopener"
      className="flex items-center gap-4 border border-border p-5 hover:bg-stone hover:border-brand transition-colors"
    >
      <FileText className="h-6 w-6 text-brand shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-serif text-lg truncate">{doc.title}</p>
        {doc.description && <p className="text-sm text-muted-foreground truncate">{doc.description}</p>}
      </div>
      <Download className="h-5 w-5 text-muted-foreground" />
    </a>
  );
}
