import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Setting = { key: string; value: any };

export function SettingsAdmin() {
  const qc = useQueryClient();
  const { data: settings = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data as Setting[];
    },
  });

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value])) as Record<string, any>;
  const [identity, setIdentity] = useState(map.identity ?? {});
  const [vision, setVision] = useState(map.vision ?? {});
  const [mission, setMission] = useState(map.mission ?? {});
  const [contact, setContact] = useState(map.contact ?? {});

  useEffect(() => {
    setIdentity(map.identity ?? {});
    setVision(map.vision ?? {});
    setMission(map.mission ?? {});
    setContact(map.contact ?? {});
  }, [settings.length]);

  async function saveOne(key: string, value: any) {
    const { error } = await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
  }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-6">Site settings</h2>
      <div className="space-y-6">
        <Block title="Identity">
          <Text label="Motto" value={identity.motto || ""} onChange={(v) => setIdentity({ ...identity, motto: v })} />
          <button onClick={() => saveOne("identity", identity)} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider">Save identity</button>
        </Block>
        <Block title="Vision">
          <TextArea label="Vision statement" value={vision.text || ""} onChange={(v) => setVision({ text: v })} />
          <button onClick={() => saveOne("vision", vision)} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider">Save vision</button>
        </Block>
        <Block title="Mission">
          <TextArea label="Mission statement" value={mission.text || ""} onChange={(v) => setMission({ text: v })} />
          <button onClick={() => saveOne("mission", mission)} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider">Save mission</button>
        </Block>
        <Block title="Contact">
          <Text label="Email" value={contact.email || ""} onChange={(v) => setContact({ ...contact, email: v })} />
          <Text label="Postal address" value={contact.postal || ""} onChange={(v) => setContact({ ...contact, postal: v })} />
          <Text label="Office address" value={contact.address || ""} onChange={(v) => setContact({ ...contact, address: v })} />
          <button onClick={() => saveOne("contact", contact)} className="bg-ink text-paper px-4 py-2 text-xs font-semibold uppercase tracking-wider">Save contact</button>
        </Block>
        <p className="text-xs text-muted-foreground">Note: phone numbers are managed in the contact JSON in the database for now; ask for inline editor if needed.</p>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border p-5 bg-stone space-y-3">
      <h3 className="font-serif text-xl">{title}</h3>
      {children}
    </section>
  );
}
function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
    </label>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm" />
    </label>
  );
}
