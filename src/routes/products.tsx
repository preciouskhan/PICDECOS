import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { productImageFor } from "@/lib/product-images";

const productsQuery = queryOptions({
  queryKey: ["products-all"],
  queryFn: async () => {
    const { data } = await supabase.from("products").select("*").order("display_order");
    return data ?? [];
  },
});

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — PICDECOS" },
      { name: "description", content: "Day-old chicks, fresh eggs, piglets, honey, flour, feed, manure, fish and more — straight from PICDECOS member farms." },
      { property: "og:title", content: "PICDECOS Products" },
      { property: "og:description", content: "Cooperative produce from member farms in the Pinyin clan." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Products,
  errorComponent: ({ error }) => <div className="p-8" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function Products() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const byCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});
  return (
    <SiteLayout>
      <section className="border-b border-border bg-brand-soft">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Products</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
            Cooperative <span className="italic text-brand">yield</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            What our member farms produce — fresh from the Pinyin highlands. Contact us to place an
            order or arrange a regular supply.
          </p>
          <div className="mt-8 rounded-4xl border border-brand/10 bg-background p-6 shadow-(--shadow-soft)">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each product below is shown with a photo when available. Add product images in the catalogue so buyers can see exactly what PICDECOS offers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl space-y-20">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-baseline justify-between mb-8 border-b border-border pb-4">
                <h2 className="font-serif text-3xl">{cat}</h2>
                <span className="text-xs font-mono text-muted-foreground">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((p) => {
                  const img = p.image_url ?? productImageFor(p.category, p.name);
                  return (
                    <article
                      key={p.id}
                      className="group bg-background rounded-2xl overflow-hidden border border-border hover:border-gold hover:shadow-(--shadow-soft) transition-all"
                    >
                      <div className="aspect-4/3 overflow-hidden bg-brand-soft">
                        <img
                          src={img}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-[10px] uppercase tracking-widest text-brand font-bold">
                          {p.category}
                        </span>
                        <h4 className="font-serif text-xl mt-1 mb-1">{p.name}</h4>
                        {p.unit && (
                          <p className="text-xs font-mono text-brand/80 mb-3">{p.unit}</p>
                        )}
                        {p.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Catalogue coming soon.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
