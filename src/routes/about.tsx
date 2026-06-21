import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import logo from "@/assets/logo.png";
import team from "@/assets/team.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PICDECOS" },
      { name: "description", content: "PICDECOS is a community-owned agro-pastoral cooperative serving the Pinyin clan. Read our vision, mission, history, and strategic priorities." },
      { property: "og:title", content: "About PICDECOS" },
      { property: "og:description", content: "Our vision, mission, milestones, and strategic priorities." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-stone">
        <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">About the cooperative</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              A cooperative <span className="italic text-brand">rooted</span> in the Pinyin clan.
            </h1>
            <p className="mt-8 max-w-3xl text-lg text-muted-foreground leading-relaxed">
              Pinyin Clan Development Cooperative Society Ltd. (PICDECOS) was formed by entrepreneurs
              from the Pinyin clan to create local employment, add value to farm produce, and deliver
              quality agro-pastoral products at affordable prices — managed by the community itself.
            </p>
          </div>
          <div className="lg:col-span-5 grid gap-6">
            <div className="rounded-4xl border border-brand/10 bg-brand-soft p-8 shadow-(--shadow-soft)">
              <div className="flex items-center justify-center h-32 w-32 mx-auto">
                <img src={logo} alt="PICDECOS logo" className="h-20 w-20 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team photo */}
      <section className="px-6 -mt-px">
        <div className="mx-auto max-w-7xl">
          <figure className="relative overflow-hidden rounded-4xl border border-border shadow-(--shadow-soft) -mt-12 lg:-mt-20">
            <img
              src={team}
              alt="PICDECOS cooperative members standing in front of a maize field in the Pinyin highlands"
              width={1600}
              height={900}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-ink/90 via-ink/40 to-transparent p-6 md:p-8 text-paper">
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-70 mb-1">Plate II — The team</p>
              <p className="font-serif text-2xl md:text-3xl">Members of PICDECOS, Pinyin · Santa Sub Division.</p>
            </figcaption>
          </figure>
        </div>
      </section>




      <section className="py-20 px-6 grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Vision</p>
          <h2 className="font-serif text-3xl mb-4">A model for African community development.</h2>
          <p className="text-muted-foreground leading-relaxed">
            To become a leading agro-pastoral cooperative — not just in Pinyin or Santa Sub Division,
            but across Mezam Division and eventually a model for community-driven development across Africa.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Mission</p>
          <h2 className="font-serif text-3xl mb-4">Local employment. Affordable produce. Shared returns.</h2>
          <p className="text-muted-foreground leading-relaxed">
            To offer employment to the Pinyin clan and deliver high-quality agro-pastoral products
            and services at affordable prices, managed by the community itself.
          </p>
        </div>
      </section>

      <section className="bg-stone py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Track record</p>
          <h2 className="font-serif text-4xl mb-12">Milestones to date.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {[
              ["4 vehicles", "K-truck, Hilux, two 20-ton trucks acquired for farm-to-market logistics."],
              ["Hatchery online", "Industrial-grade incubator commissioned and producing day-old chicks."],
              ["Feed packaging", "Customized animal feed packaging launched for member farms."],
              ["Layer farm", "Commercial layer project entered its first operational phase."],
              ["Farm-to-market", "Initiative connecting producers directly to buyers across the region."],
              ["Input access", "Strengthened access to seed, feed, and inputs for member farmers."],
            ].map(([title, body]) => (
              <div key={title} className="bg-background p-8">
                <h4 className="font-serif text-xl mb-3 text-brand">{title}</h4>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Honest report</p>
          <h2 className="font-serif text-4xl mb-12">Challenges we are facing.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              ["Underperformed projections", "We did not fully meet projections since the last General Assembly."],
              ["Market fluctuations", "Global pricing volatility continues to affect costs and margins."],
              ["Climate variability", "Shifting rains have disrupted planting and harvest cycles."],
              ["Infrastructure gaps", "Limited rural infrastructure constrains scale and processing."],
              ["Piggery disease loss", "A disease outbreak in our piggery caused major financial loss."],
              ["Share payments", "Incomplete share subscription by some members remains a discipline issue."],
            ].map(([title, body]) => (
              <div key={title} className="border-l-2 border-brand pl-6">
                <h4 className="font-serif text-xl mb-2">{title}</h4>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Strategy</p>
          <h2 className="font-serif text-4xl mb-12">Forward priorities.</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              "Expansion & inclusion",
              "Value addition / agro-processing",
              "Climate-smart agriculture",
              "Youth & agripreneurship",
              "Governance & transparency",
            ].map((p, i) => (
              <div key={p}>
                <span className="text-brand font-mono text-sm">0{i + 1}</span>
                <p className="font-serif text-xl mt-2 leading-tight">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-xs uppercase tracking-widest opacity-60 mb-3">Aligned with</p>
            <p className="font-serif text-2xl opacity-90">
              Cameroon's National Development Strategy 2020–2030 · African Union Agenda 2063 ·
              UN SDGs 1, 2, 8 & 13.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
