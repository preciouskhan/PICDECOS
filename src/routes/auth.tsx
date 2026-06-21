import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin sign-in — PICDECOS" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [adminCount, setAdminCount] = useState<number | null>(null);

  useEffect(() => {
    // If already signed in and is admin, jump to /admin
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
        if (roles && roles.length > 0) navigate({ to: "/admin" });
      }
    });
    // Count admins (anyone can read their own row, but we use RPC via has_role bootstrap)
    supabase.from("user_roles").select("user_id", { count: "exact", head: true }).then(({ count, error }) => {
      if (error) setAdminCount(null); else setAdminCount(count ?? 0);
    });
  }, [navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      // verify admin
      const { data: user } = await supabase.auth.getUser();
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.user!.id);
      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        return toast.error("This account is not an admin. Contact a Super Admin.");
      }
      navigate({ to: "/admin" });
    } else {
      // signup — only allowed for first admin
      const full_name = String(fd.get("full_name") ?? "").trim();
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name }, emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) { setBusy(false); return toast.error(error.message); }
      // grant super_admin role for the very first admin (only succeeds when table is empty per RLS via INSERT direct)
      if (data.user) {
        const { error: roleErr } = await supabase.from("user_roles").insert({ user_id: data.user.id, role: "super_admin" });
        if (roleErr) {
          setBusy(false);
          return toast.error("Initial admin already exists. Ask the Super Admin to invite you.");
        }
      }
      setBusy(false);
      toast.success("Super Admin account created. You can sign in now.");
      setMode("signin");
    }
  }

  const showSignup = adminCount === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <span className="font-serif text-3xl text-brand font-bold">PICDECOS</span>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Admin Console</p>
        </Link>
        <div className="bg-background border border-border p-8">
          <h1 className="font-serif text-2xl mb-1">
            {mode === "signin" ? "Sign in" : "Create the first admin"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signin"
              ? "Manage cooperative content and messages."
              : "No admins exist yet. Set up the first Super Admin."}
          </p>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <Field label="Full name" name="full_name" />
            )}
            <Field label="Email" name="email" type="email" required />
            <Field label="Password" name="password" type="password" required />
            <button type="submit" disabled={busy}
              className="w-full bg-ink text-paper py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-50 mt-2">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create admin"}
            </button>
          </form>
          {showSignup && (
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-4 w-full text-xs uppercase tracking-widest text-muted-foreground hover:text-brand">
              {mode === "signin" ? "First time? Create initial admin →" : "← Back to sign in"}
            </button>
          )}
        </div>
        <Link to="/" className="block text-center mt-6 text-xs uppercase tracking-widest text-muted-foreground hover:text-brand">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input name={name} type={type} required={required}
        className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
    </label>
  );
}
