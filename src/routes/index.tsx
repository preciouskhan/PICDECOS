import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight, Leaf, Truck, Egg, Wheat, Hammer, Beef } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { productImageFor } from "@/lib/product-images";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: async () => {
    const [posts, projects, products] = await Promise.all([
      supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false }).limit(3),
      supabase.from("projects").select("*").order("display_order").limit(4),
      supabase.from("products").select("*").order("display_order").limit(4),
    ]);
    return {
      posts: posts.data ?? [],
      projects: projects.data ?? [],
      products: products.data ?? [],
    };
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PICDECOS — From the Soil We Grow" },
      { name: "description", content: "Pinyin Clan Development Cooperative Society: a community-owned agro-pastoral cooperative in Cameroon's North West Region." },
      { property: "og:title", content: "PICDECOS — From the Soil We Grow" },
      { property: "og:description", content: "Pinyin Clan Development Cooperative Society: community-owned agro-pastoral cooperative." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: Home,
  errorComponent: ({ error }) => <div className="p-8" role="alert">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

const pillars = [
  { icon: Egg, name: "Poultry", desc: "Layers, broilers, hatchery." },
  { icon: Beef, name: "Piggery & Cattle", desc: "Livestock rearing & breeding." },
  { icon: Wheat, name: "Crops & Apiary", desc: "Potatoes, maize, soya, honey." },
  { icon: Leaf, name: "Agro-Processing", desc: "Flour, feed, value addition." },
  { icon: Truck, name: "Logistics", desc: "Farm-to-market transport." },
  { icon: Hammer, name: "Construction", desc: "Materials & real estate." },
];

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-brand-soft text-brand-deep text-[10px] font-bold uppercase tracking-widest rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Community Owned · Pinyin · Cameroon
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              From the <span className="italic text-brand">Soil</span><br />We Grow.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              PICDECOS is a registered agro-pastoral cooperative society serving the Pinyin clan
              of Santa Sub Division — creating local employment, adding value to farm produce,
              and building shared prosperity for the North West Region.
            </p>
            <div className="mt-10 flex gap-4 items-center flex-wrap">
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 bg-brand text-brand-foreground px-7 py-3.5 text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-gold hover:text-gold-foreground transition-all shadow-(--shadow-soft)"
              >
                Explore our work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold uppercase tracking-wider text-foreground/80 hover:text-brand underline underline-offset-8 decoration-brand"
              >
                Our story
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-(--shadow-soft) border border-border">
              <img
                src={heroImg}
                alt="A Cameroonian farmer working a green maize field in the Pinyin highlands at golden hour"
                className="absolute inset-0 h-full w-full object-cover"
                width={1024}
                height={1280}
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-paper">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] opacity-80">Plate I</span>
                  <img src={logo} alt="" className="h-12 w-12 opacity-95 drop-shadow-lg" />
                </div>
                <div>
                  <p className="font-serif italic text-2xl leading-snug">
                    "No matter how rich you become, you can never do without food."
                  </p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] opacity-70">African proverb</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars — green by default, ink on hover (as user requested) */}
      <section className="py-24 px-6 bg-stone">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2">01 — Operations</p>
              <h2 className="font-serif text-4xl md:text-5xl">Pillars of our cooperative.</h2>
            </div>
            <Link to="/work" className="text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-deep underline underline-offset-8 decoration-gold">
              All 12 disciplines
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <div
                key={p.name}
                className="group bg-brand text-brand-foreground p-8 rounded-2xl shadow-(--shadow-soft) hover:bg-gold hover:text-gold-foreground hover:shadow-xl transition-all duration-300 cursor-default relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 group-hover:bg-gold/15 transition-colors" />
                <p.icon className="h-7 w-7 mb-6 text-gold group-hover:text-gold transition-colors" />
                <p className="text-xs font-mono text-brand-foreground/60 mb-2">
                  0{i + 1}.
                </p>
                <h3 className="font-serif text-2xl mb-2">{p.name}</h3>
                <p className="text-sm text-brand-foreground/85">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue preview */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Catalogue</p>
              <h2 className="font-serif text-4xl md:text-5xl">Products with clear images.</h2>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Every product in this preview shows a real image, category, and unit detail. Upload logo and product photos later to keep the catalogue fresh and attractive.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.products.map((product) => (
              <article
                key={product.id}
                className="group bg-background rounded-3xl overflow-hidden border border-border hover:border-gold hover:shadow-(--shadow-strong) transition-all duration-300"
              >
                <div className="aspect-5/4 overflow-hidden bg-brand-soft">
                  <img
                    src={product.image_url ?? productImageFor(product.category, product.name)}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-brand font-bold">
                      {product.category}
                    </span>
                    {product.unit && (
                      <span className="rounded-full border border-brand/20 bg-brand-soft px-2 py-1 text-[10px] uppercase text-brand">
                        {product.unit}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl mt-3">{product.name}</h3>
                  {product.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-right">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-widest text-brand-foreground shadow-(--shadow-soft) hover:bg-gold hover:text-gold-foreground transition-colors"
            >
              View full catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects + Updates */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2">02 — Portfolio</p>
            <h2 className="font-serif text-4xl mb-10">Active projects.</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.projects.map((p) => (
                <article key={p.id} className="bg-background border border-border p-6 rounded-xl hover:border-brand hover:shadow-(--shadow-soft) transition-all">
                  <StatusBadge status={p.status} />
                  <h4 className="font-serif text-xl mt-3 mb-2">{p.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                </article>
              ))}
            </div>
            <Link to="/projects" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-deep underline underline-offset-8 decoration-gold">
              See all projects →
            </Link>
          </div>
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2">03 — Updates</p>
            <h2 className="font-serif text-4xl mb-10">Latest news.</h2>
            <div className="space-y-6">
              {data.posts.map((post) => (
                <article key={post.id} className="border-b border-border pb-6 last:border-0">
                  <time className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    {new Date(post.published_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    <span className="text-brand">{post.category}</span>
                  </time>
                  <h4 className="font-serif text-lg mt-2 leading-snug">{post.title}</h4>
                  {post.excerpt && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                </article>
              ))}
            </div>
            <Link to="/updates" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-deep underline underline-offset-8 decoration-gold">
              All updates →
            </Link>
          </div>
        </div>
      </section>

      {/* Products preview */}
      <section className="py-24 px-6 bg-stone">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand font-bold mb-2">04 — Yield</p>
              <h2 className="font-serif text-4xl">Cooperative produce.</h2>
            </div>
            <Link to="/products" className="text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-deep underline underline-offset-8 decoration-gold">
              Full catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.products.map((p) => (
              <ProductMini key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing motto */}
      <section className="relative py-24 px-6 text-center text-paper overflow-hidden" style={{ background: "var(--gradient-brand)" }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative">
          <img src={logo} alt="" className="h-20 w-20 mx-auto mb-6 opacity-95 drop-shadow-xl" />
          <p className="font-serif italic text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            "From the soil we grow,<br />and from unity, we prosper."
          </p>
          <Link to="/contact" className="mt-10 inline-flex items-center gap-2 bg-paper text-brand-deep px-7 py-3.5 text-sm font-semibold uppercase tracking-wider rounded-full hover:bg-gold hover:text-gold-foreground transition-colors">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}


function ProductMini({ product }: { product: { id: string; name: string; category: string; unit: string | null; image_url: string | null } }) {
  const img = product.image_url ?? productImageFor(product.category, product.name);
  return (
    <article className="group bg-background rounded-xl overflow-hidden border border-border hover:border-gold hover:shadow-(--shadow-soft) transition-all">
      <div className="aspect-square overflow-hidden bg-brand-soft">
        {img && (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-4">
        <span className="text-[10px] uppercase tracking-widest text-brand font-bold">{product.category}</span>
        <h4 className="font-serif text-lg mt-1">{product.name}</h4>
        {product.unit && <p className="mt-1 text-xs text-muted-foreground">{product.unit}</p>}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    planned: "bg-stone text-foreground border border-border",
    ongoing: "bg-brand text-brand-foreground",
    completed: "bg-ink text-paper",
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${styles[status] ?? styles.planned}`}>
      {status}
    </span>
  );
}
