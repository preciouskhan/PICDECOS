import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, MailOpen } from "lucide-react";

type Msg = { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; read: boolean; created_at: string };

export function MessagesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Msg[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-messages"] });
    qc.invalidateQueries({ queryKey: ["unread-messages"] });
  };

  const toggleRead = useMutation({
    mutationFn: async (m: Msg) => { const { error } = await supabase.from("contact_messages").update({ read: !m.read }).eq("id", m.id); if (error) throw error; },
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Messages</h2>
      <div className="space-y-3">
        {data.map((m) => (
          <article key={m.id} className={`border p-4 ${m.read ? "border-border" : "border-brand bg-accent/30"}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <p className="font-semibold">{m.name} <span className="text-muted-foreground text-sm font-normal">· {m.email}</span></p>
                {m.subject && <p className="font-serif text-lg mt-1">{m.subject}</p>}
                <p className="text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleString()}{m.phone && ` · ${m.phone}`}</p>
                <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleRead.mutate(m)} className="p-2 hover:text-brand" title={m.read ? "Mark unread" : "Mark read"}><MailOpen className="h-4 w-4" /></button>
                <button onClick={() => confirm("Delete this message?") && del.mutate(m.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
        {data.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>}
      </div>
    </div>
  );
}
