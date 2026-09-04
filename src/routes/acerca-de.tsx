import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/acerca-de")({
  head: () => ({
    meta: [
      { title: "Acerca de nosotros — Inmobiliaria Tomicic" },
      {
        name: "description",
        content: "Conocé a Inmobiliaria Tomicic y nuestra forma de acompañarte.",
      },
    ],
  }),
  component: AcercaDePage,
});

function AcercaDePage() {
  return (
    <section className="mx-auto max-w-7xl animate-fade-up px-6 py-20">
      <p className="mb-3 font-mono text-sm text-brand-blue">[ ACERCA DE NOSOTROS ]</p>
      <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
          Tu proyecto inmobiliario, acompañado de cerca.
        </h1>
        <div className="rounded-3xl bg-card p-8 shadow-xl shadow-fg/5 ring-1 ring-fg/5">
          <h2 className="text-2xl font-bold">Tomicic Negocios Inmobiliarios</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-fg/65">
            <p>
              Somos Tomicic Negocios Inmobiliarios. Nuestro trabajo es la gestión inmobiliaria
              (compra, ventas, alquileres, tasaciones), y buscamos hacerlo conectando nuestro
              conocimiento con las nuevas ideas teniendo como principal meta la excelencia
              profesional.
            </p>
            <p>
              Nuestro objetivo es prestar el más amplio rango de servicios inmobiliarios y
              ofrecerte un lugar donde te sientas cómodo y seguro a la hora de realizar
              operaciones. Porque sabemos que detrás de ellas están tus sueños, tus proyectos,
              tus metas.
            </p>
            <p>
              Los que hacemos Tomicic Negocios Inmobiliarios te vamos a acompañar en ese camino.
              Porque entendemos de negocios inmobiliarios, pero además ponemos nuestra integridad,
              consistencia y calidad a tu servicio.
            </p>
            <p>
              Creemos fuertemente que la manera de trabajar es generando igualdad de oportunidades,
              consolidando las relaciones con nuestros clientes y colegas. Somos una inmobiliaria
              independiente que se compromete con su entorno, para satisfacer las necesidades de
              cada cliente.
            </p>
            <p>
              En Tomicic Negocios Inmobiliarios, vas a poder cumplir tus sueños sin miedo con el
              mejor asesoramiento profesional.
            </p>
          </div>
          <Link
            to="/contacto"
            className="mt-8 inline-flex rounded-xl bg-brand-gray px-6 py-3 text-sm font-bold uppercase tracking-tighter text-brand-contrast transition-colors hover:bg-brand-gray/85"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </section>
  );
}
