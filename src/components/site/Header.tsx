import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/work" as const, label: "Our Work" },
  { to: "/products" as const, label: "Products" },
  { to: "/projects" as const, label: "Projects" },
  { to: "/updates" as const, label: "Updates" },
  { to: "/documents" as const, label: "Documents" },
  { to: "/contact" as const, label: "Contact" },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="PICDECOS"
            width={56}
            height={56}
            className="h-12 w-12 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-bold tracking-tight text-brand">
              PICDECOS
            </span>
            <span className="hidden md:inline text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Pinyin Clan Cooperative
            </span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative text-xs font-semibold uppercase tracking-widest transition-colors ${
                  active
                    ? "text-brand after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-brand"
                    : "text-foreground/70 hover:text-brand"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-widest text-foreground/80 hover:text-brand"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
