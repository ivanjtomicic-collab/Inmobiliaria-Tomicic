import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const CONTACT_EMAIL = "inmobiliariatomicic@gmail.com";

type InquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  website?: string;
};

export function ContactSection({
  propertyId,
  propertyTitle,
  defaultInterest,
}: {
  propertyId?: string;
  propertyTitle?: string;
  defaultInterest?: string;
}) {
  const [sending, setSending] = useState(false);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload: InquiryPayload = {
      firstName: String(form.get("nombre") ?? "").trim(),
      lastName: String(form.get("apellido") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      interest: String(form.get("interes") ?? "Consulta inmobiliaria").trim(),
      message: String(form.get("mensaje") ?? "").trim(),
      ...(propertyId ? { propertyId } : {}),
      ...(propertyTitle ? { propertyTitle } : {}),
      website: String(form.get("website") ?? ""),
    };

    setSending(true);
    try {
      if (!supabase) throw new Error("Supabase no está configurado.");

      const { data, error } = await supabase.functions.invoke("submit-inquiry", {
        body: payload,
      });

      if (error) {
        const { error: storageError } = await supabase.from("inquiries").insert({
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          interest: payload.interest,
          message: payload.message,
          property_id: payload.propertyId ?? null,
          property_title: payload.propertyTitle ?? null,
          source_url: window.location.href.slice(0, 1000),
        });
        if (storageError) throw storageError;
        toast.success("Recibimos tu consulta. Nos comunicaremos a la brevedad.");
      } else {
        toast.success(
          data?.emailSent
            ? "Consulta enviada. Revisá tu correo para ver la confirmación."
            : "Recibimos tu consulta. Nos comunicaremos a la brevedad.",
        );
      }

      formElement.reset();
    } catch {
      const subject = encodeURIComponent(
        `${payload.interest} - Consulta de ${payload.firstName} ${payload.lastName}`,
      );
      const body = encodeURIComponent(
        `Nombre: ${payload.firstName}\nApellido: ${payload.lastName}\nEmail: ${payload.email}\nInterés: ${payload.interest}\nPropiedad: ${payload.propertyTitle ?? "Consulta general"}\n\nMensaje:\n${payload.message}`,
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      toast.info("Abrimos tu correo para que puedas completar el envío.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="bg-brand-gray px-6 py-24 text-brand-contrast">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            {propertyTitle ? "Consultá por esta propiedad." : "Consulta sobre tu próxima inversión."}
          </h2>
          {propertyTitle && (
            <p className="mb-3 max-w-md text-xl font-bold text-brand-contrast">
              {propertyTitle}
            </p>
          )}
          <p className="max-w-md text-lg text-brand-contrast/70">
            Nuestro equipo está listo para asesorarte en la compra, venta o alquiler de tu
            propiedad en todo el país.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-contrast/25 font-mono text-xs">
                01
              </div>
              <p className="font-medium">Aspirante Gazo 167</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-brand-contrast/25 font-mono text-xs">
                02
              </div>
              <p className="font-medium">+54 9 2475 41-3001</p>
            </div>
          </div>
        </div>
        <form
          className="flex flex-col gap-6 rounded-3xl bg-bg p-8 text-fg"
          onSubmit={submitInquiry}
        >
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Nombre
              </label>
              <input id="nombre" name="nombre" required maxLength={100} autoComplete="given-name" className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="apellido" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Apellido
              </label>
              <input id="apellido" name="apellido" required maxLength={100} autoComplete="family-name" className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2" />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Email
              </label>
              <input id="email" name="email" required type="email" maxLength={254} autoComplete="email" className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="interes" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
              Interés
            </label>
            <select id="interes" name="interes" defaultValue={defaultInterest} className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2">
              <option>Comprar una propiedad</option>
              <option>Alquilar un inmueble</option>
              <option>Vender mi propiedad</option>
              <option>Tasaciones</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="mensaje" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
              Mensaje
            </label>
            <textarea id="mensaje" name="mensaje" rows={4} maxLength={3000} required defaultValue={propertyTitle ? `Hola, me interesa la propiedad "${propertyTitle}".` : ""} className="resize-none rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2" />
          </div>
          <button type="submit" disabled={sending} className="w-full rounded-2xl bg-brand-blue py-5 font-bold uppercase tracking-tighter text-fg transition-all hover:bg-brand-blue/80 disabled:cursor-wait disabled:opacity-60">
            {sending ? "Enviando..." : "Enviar consulta"}
          </button>
          <p className="text-center text-xs text-fg/50">
            Guardaremos tus datos únicamente para responder esta consulta.
          </p>
        </form>
      </div>
    </section>
  );
}
