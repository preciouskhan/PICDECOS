import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";

type Role = "super_admin" | "editor";
type Row = { user_id: string; role: Role; email: string | null; full_name: string | null };

export function UsersAdmin({ currentUserId }: { currentUserId: string }) {
  const qc = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
      const grouped = new Map<string, Row>();
      for (const r of roles ?? []) {
        const existing = grouped.get(r.user_id);
        if (existing) {
          // prefer super_admin
          if (r.role === "super_admin") existing.role = "super_admin";
        } else {
          grouped.set(r.user_id, { user_id: r.user_id, role: r.role as Role, email: null, full_name: pmap.get(r.user_id)?.full_name ?? null });
        }
      }
      return Array.from(grouped.values());
    },
  });

  const revoke = useMutation({
    mutationFn: async (user_id: string) => {
      if (user_id === currentUserId) throw new Error("You cannot remove yourself.");
      const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Admin removed"); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-serif text-2xl">Admin accounts</h2>
        <button onClick={() => setShowInvite(!showInvite)} className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-3 py-2 text-xs font-semibold uppercase tracking-wider">
          <UserPlus className="h-4 w-4" /> Invite admin
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-6">{rows.length} / 5 admin accounts in use.</p>

      {showInvite && <InviteForm onDone={() => { setShowInvite(false); qc.invalidateQueries({ queryKey: ["admin-users"] }); }} />}

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.user_id} className="flex items-center justify-between gap-4 border border-border p-4">
            <div className="min-w-0">
              <p className="font-semibold">{r.full_name || r.user_id}</p>
              <p className="text-xs text-muted-foreground capitalize">{r.role.replace("_", " ")}{r.user_id === currentUserId && " · You"}</p>
            </div>
            {r.user_id !== currentUserId && (
              <button onClick={() => confirm("Remove this admin?") && revoke.mutate(r.user_id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InviteForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    // Sign up the new user (will receive confirmation email depending on settings)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error || !data.user) { setBusy(false); return toast.error(error?.message || "Could not create user"); }
    const { error: roleErr } = await supabase.from("user_roles").insert({ user_id: data.user.id, role });
    setBusy(false);
    if (roleErr) return toast.error(roleErr.message);
    toast.success("Admin invited. They can now sign in.");
    setEmail(""); setPassword(""); setFullName(""); setRole("editor");
    onDone();
  }
  return (
    <form onSubmit={submit} className="border border-brand p-4 mb-6 space-y-3 bg-stone">
      <h3 className="font-serif text-lg">Invite a new admin</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Temporary password</span>
          <input type="text" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm">
            <option value="editor">Editor</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">Share the email and temporary password securely. The new admin can sign in immediately.</p>
      <button type="submit" disabled={busy} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-50">{busy ? "Inviting…" : "Create admin"}</button>
    </form>
  );
}
