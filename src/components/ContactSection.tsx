import { toast } from "sonner";

const CONTACT_EMAIL = "inmobiliariatomicic@gmail.com";

export function ContactSection({
  propertyTitle,
  defaultInterest,
}: {
  propertyTitle?: string;
  defaultInterest?: string;
}) {

  return (
    <section id="contacto" className="bg-brand-gray px-6 py-24 text-brand-contrast">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Consulta sobre <br /> tu próxima inversión.
          </h2>
          <p className="max-w-md text-lg text-brand-contrast/70">
            Nuestro equipo de expertos está listo para asesorarte en la compra, venta o alquiler de
            tu propiedad en todo el país.
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
              <p className="font-medium">+54 2364 222882</p>
            </div>
          </div>
        </div>
        <form
          className="flex flex-col gap-6 rounded-3xl bg-bg p-8 text-fg"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const nombre = String(form.get("nombre") ?? "");
            const apellido = String(form.get("apellido") ?? "");
            const email = String(form.get("email") ?? "");
            const interes = String(form.get("interes") ?? "Consulta inmobiliaria");
            const mensaje = String(form.get("mensaje") ?? "");
            const subject = encodeURIComponent(`${interes} - Consulta de ${nombre} ${apellido}`);
            const body = encodeURIComponent(
              `Nombre: ${nombre}\nApellido: ${apellido}\nEmail: ${email}\nInterés: ${interes}\n\nMensaje:\n${mensaje}`,
            );

            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
            toast.success("Abrimos tu aplicación de correo para completar el envío.");
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                required
                type="text"
                className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="apellido" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                required
                type="text"
                autoComplete="family-name"
                className="rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                Email
              </label>
              <input
                id="email"
                name="email"
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
              name="interes"
              defaultValue={defaultInterest}
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
              name="mensaje"
              rows={4}
              defaultValue={propertyTitle ? `Hola, me interesa la propiedad "${propertyTitle}".` : ""}
              className="resize-none rounded-xl border border-fg/5 bg-bg p-4 outline-none ring-brand-blue/20 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-blue py-5 font-bold uppercase tracking-tighter text-fg transition-all hover:bg-brand-blue/80"
          >
            Enviar Consulta
          </button>
          <p className="text-center text-xs text-fg/50">
            La consulta se enviará a {CONTACT_EMAIL}.
          </p>
        </form>
      </div>
    </section>
  );
}
