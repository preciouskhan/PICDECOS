import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText, FolderKanban, Package, Files, Inbox, Settings, Users, LogOut,
} from "lucide-react";
import { PostsAdmin } from "@/components/admin/PostsAdmin";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";
import { DocumentsAdmin } from "@/components/admin/DocumentsAdmin";
import { MessagesAdmin } from "@/components/admin/MessagesAdmin";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — PICDECOS" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "posts" | "projects" | "products" | "documents" | "messages" | "settings" | "users";

const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "posts", label: "Updates", icon: FileText },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "products", label: "Products", icon: Package },
  { id: "documents", label: "Documents", icon: Files },
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "users", label: "Admins", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [active, setActive] = useState<Tab>("posts");
  const { user, roles } = Route.useRouteContext();
  const isSuper = roles.includes("super_admin");

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const unread = useQuery({
    queryKey: ["unread-messages"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false);
      return count ?? 0;
    },
  });

  return (
    <div className="min-h-screen bg-stone">
      <header className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-serif text-2xl font-bold text-brand">PICDECOS</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:block">{user.email} · {isSuper ? "Super Admin" : "Editor"}</span>
            <button onClick={signOut} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-brand">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {tabs.map((t) => {
            const disabled = t.id === "users" && !isSuper;
            return (
              <button
                key={t.id}
                disabled={disabled}
                onClick={() => setActive(t.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                  active === t.id ? "bg-ink text-paper" : "hover:bg-background text-foreground/80"
                } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <t.icon className="h-4 w-4" /> {t.label}
                </span>
                {t.id === "messages" && unread.data ? (
                  <span className="bg-brand text-brand-foreground text-[10px] font-bold rounded-full px-2 py-0.5">{unread.data}</span>
                ) : null}
              </button>
            );
          })}
        </aside>

        <section className="bg-background border border-border p-6 min-h-[60vh]">
          {active === "posts" && <PostsAdmin />}
          {active === "projects" && <ProjectsAdmin />}
          {active === "products" && <ProductsAdmin />}
          {active === "documents" && <DocumentsAdmin />}
          {active === "messages" && <MessagesAdmin />}
          {active === "settings" && <SettingsAdmin />}
          {active === "users" && isSuper && <UsersAdmin currentUserId={user.id} />}
        </section>
      </div>
    </div>
  );
}
