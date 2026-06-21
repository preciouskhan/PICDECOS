import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(50).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Please write a message").max(2000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PICDECOS" },
      { name: "description", content: "Reach PICDECOS by phone, email, or message form. Offices in Pinyin, Santa Sub Division, North West Region, Cameroon." },
      { property: "og:title", content: "Contact PICDECOS" },
      { property: "og:description", content: "Send us a message or call our Cameroon or international lines." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      subject: form.get("subject") || undefined,
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) { toast.error("Could not send message."); return; }
    toast.success("Message sent. We'll be in touch.");
    (e.target as HTMLFormElement).reset();
  }
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-brand font-bold mb-4">Contact</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">Get in touch.</h1>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl mb-8">Visit, call, or write.</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-brand shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Office</p>
                  <p>Pinyin, Santa Sub Division</p>
                  <p>Mezam Division, North West Region, Cameroon</p>
                  <p className="text-muted-foreground text-sm mt-1">P.O. Box 714, Bamenda</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-5 w-5 text-brand shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                  <p>+237 670 769 326 <span className="text-xs text-muted-foreground">(Cameroon)</span></p>
                  <p>+237 676 250 729 <span className="text-xs text-muted-foreground">(Cameroon)</span></p>
                  <p>+1 (484) 682-2800 <span className="text-xs text-muted-foreground">(USA)</span></p>
                  <p>+971 329 287 736 <span className="text-xs text-muted-foreground">(UAE)</span></p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-5 w-5 text-brand shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                  <p>piedecos2024@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="border border-border p-8 space-y-4 bg-card">
            <h2 className="font-serif text-2xl mb-2">Send a message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone (optional)" name="phone" />
              <Field label="Subject (optional)" name="subject" />
            </div>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</span>
              <textarea name="message" required rows={6} maxLength={2000}
                className="mt-1.5 block w-full border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none" />
            </label>
            <button type="submit" disabled={submitting}
              className="w-full bg-ink text-paper py-3 text-sm font-semibold uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-50">
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
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
