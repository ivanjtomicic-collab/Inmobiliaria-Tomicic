import { useState } from "react";
import { toast } from "sonner";

export function ContactSection({ propertyTitle }: { propertyTitle?: string }) {
  const [sent, setSent] = useState(false);

  return (
    <section id="contacto" className="bg-brand-gray px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Consulta sobre <br /> tu próxima inversión.
          </h2>
          <p className="max-w-md text-lg text-white/60">
            Nuestro equipo de expertos en Real Estate está listo para asesorarte en la compra, venta
            o alquiler de tu propiedad en todo el país.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-xs">
                01
              </div>
              <p className="font-medium">Av. del Libertador 1200, CABA</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-xs">
                02
              </div>
              <p className="font-medium">+54 11 4567 8900</p>
            </div>
          </div>
        </div>
        <form
          className="flex flex-col gap-6 rounded-3xl bg-white p-8 text-fg"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Consulta enviada. Te contactaremos a la brevedad.");
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Nombre
              </label>
              <input
                id="nombre"
                required
                type="text"
                className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Email
              </label>
              <input
                id="email"
                required
                type="email"
                className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="interes" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
              Interés
            </label>
            <select
              id="interes"
              className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
            >
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
            <textarea
              id="mensaje"
              rows={4}
              defaultValue={propertyTitle ? `Hola, me interesa la propiedad "${propertyTitle}".` : ""}
              className="resize-none rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-blue py-5 font-bold uppercase tracking-tighter text-fg transition-all hover:bg-brand-blue/80"
          >
            {sent ? "Consulta enviada ✓" : "Enviar Consulta"}
          </button>
        </form>
      </div>
    </section>
  );
}
