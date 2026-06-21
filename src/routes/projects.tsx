import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";

const projectsQuery = queryOptions({
  queryKey: ["projects-all"],
  queryFn: async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order");
    return data ?? [];
  },
});

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — PICDECOS" },
      { name: "description", content: "Active, planned, and completed PICDECOS projects — from layer farms to cold storage to agro-processing plants." },
      { property: "og:title", content: "PICDECOS Projects" },
      { property: "og:description", content: "Our portfolio of cooperative projects across the Pinyin clan." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQuery),
  component: Projects,
  errorComponent: ({ error }) => <div className="p-8" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

const statusOrder = { ongoing: 0, planned: 1, completed: 2 } as const;

function Projects() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const sorted = [...projects].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Portfolio</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
            Projects across the cooperative.
          </h1>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((p) => (
            <article key={p.id} className="border border-border p-6 flex flex-col">
              <StatusBadge status={p.status} />
              <h3 className="font-serif text-2xl mt-4 mb-3">{p.name}</h3>
              <p className="text-sm text-muted-foreground flex-1">{p.description}</p>
              {p.started_at && (
                <p className="mt-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Started {new Date(p.started_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </p>
              )}
            </article>
          ))}
          {projects.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-16">No projects yet.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    planned: "bg-stone text-foreground",
    ongoing: "bg-brand text-brand-foreground",
    completed: "bg-ink text-paper",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest w-fit ${styles[status] ?? styles.planned}`}>
      {status}
    </span>
  );
}
