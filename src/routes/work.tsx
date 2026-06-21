import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

const sectors = [
  ["Poultry", "Commercial breeding of layers and broilers, plus a hatchery producing day-old chicks."],
  ["Piggery", "Pig rearing, piglet sales, and pork — rebuilding after past disease setbacks."],
  ["Cattle Rearing", "Building a sustainable cattle programme for the cooperative."],
  ["Crop Farming", "Irish potatoes, sweet potatoes, tomatoes, carrots, maize, soya, cassava."],
  ["Apiary", "Bee farming and natural highland honey for local and regional markets."],
  ["Fish Farming", "Tilapia and other species as protein for the community."],
  ["Agro-Processing", "Transforming maize, cassava, potatoes and soya into flour and animal feed."],
  ["Manure Production", "Dried fowl droppings and pig dung — sold and used on our own farms."],
  ["Logistics", "K-truck, Hilux, and two 20-ton trucks moving produce farm-to-market."],
  ["Construction & Materials", "Aggregate crushing, supply of construction materials, project execution."],
  ["Real Estate", "Generating capital for livestock and agriculture investment."],
  ["Financial Facilitation", "Savings, credit access, and loan negotiation support for members."],
];

const future = [
  "Meat processing plant",
  "Cold storage & distribution",
  "Refrigerated retail outlets (Pinyin, Santa, Bamenda)",
  "Marketing board for farm produce",
  "Animal feed & accessories depot",
  "Construction materials depot",
  "Mushroom farming",
  "Waste-to-fertilizer transformation",
  "Member micro-project schemes",
  "Staff training programme",
];

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work — PICDECOS" },
      { name: "description", content: "The full scope of PICDECOS activity: poultry, piggery, crops, apiary, fish, agro-processing, logistics, construction, real estate, and financial services." },
      { property: "og:title", content: "Our Work — PICDECOS" },
      { property: "og:description", content: "Twelve disciplines across agriculture, livestock, processing, logistics, construction, and finance." },
    ],
  }),
  component: Work,
});

function Work() {
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Our Work</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            Twelve disciplines, one cooperative.
          </h1>
          <p className="mt-8 max-w-3xl text-lg text-muted-foreground">
            PICDECOS operates across the full agro-pastoral value chain — from seed and chick through
            processing, packaging, logistics, and retail.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {sectors.map(([name, desc], i) => (
            <div key={name} className="group bg-background p-8 hover:bg-brand hover:text-brand-foreground transition-colors">
              <p className="text-xs font-mono italic mb-4 text-brand group-hover:text-brand-foreground/70">
                {String(i + 1).padStart(2, "0")}.
              </p>
              <h3 className="font-serif text-2xl mb-3">{name}</h3>
              <p className="text-sm text-muted-foreground group-hover:text-brand-foreground/85">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-3">Future</p>
          <h2 className="font-serif text-4xl mb-12">Planned expansions.</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {future.map((f) => (
              <li key={f} className="bg-background border border-border px-5 py-4 text-sm font-medium">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
