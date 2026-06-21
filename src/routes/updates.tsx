import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";

const updatesQuery = queryOptions({
  queryKey: ["updates-all"],
  queryFn: async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  },
});

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Updates — PICDECOS" },
      { name: "description", content: "News and announcements from the Pinyin Clan Development Cooperative Society: milestones, investments, and partnerships." },
      { property: "og:title", content: "PICDECOS Updates" },
      { property: "og:description", content: "Milestones, investments, and partnerships from PICDECOS." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(updatesQuery),
  component: Updates,
  errorComponent: ({ error }) => <div className="p-8" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Updates() {
  const { data: posts } = useSuspenseQuery(updatesQuery);
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Updates</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
            From the field.
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
            Milestones, investments, partnerships, and announcements from the cooperative.
          </p>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-12">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-border pb-12 last:border-0">
              <div className="flex items-center gap-3 mb-4">
                <time className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {new Date(post.published_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </time>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                  {post.category}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">{post.title}</h2>
              {post.excerpt && (
                <p className="text-lg text-muted-foreground italic mb-4">{post.excerpt}</p>
              )}
              <div className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-wrap">
                {post.body}
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No updates yet.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
