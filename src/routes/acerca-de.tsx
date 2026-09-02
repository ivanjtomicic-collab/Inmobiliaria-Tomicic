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
          {/* Reemplazá estos párrafos con la historia y la información de la inmobiliaria. */}
          <h2 className="text-2xl font-bold">Inmobiliaria Tomicic</h2>
          <p className="mt-5 leading-relaxed text-fg/65">
            En este espacio podés contar quiénes son, su trayectoria, sus valores y la experiencia
            que ofrecen a cada cliente.
          </p>
          <p className="mt-4 leading-relaxed text-fg/65">
            También podés sumar información sobre las zonas en las que trabajan y qué distingue su
            servicio en operaciones de compra, venta, alquiler y tasación.
          </p>
          <Link
            to="/contacto"
            className="mt-8 inline-flex rounded-xl bg-brand-gray px-6 py-3 text-sm font-bold uppercase tracking-tighter text-white transition-colors hover:bg-fg"
          >
            Contactanos
          </Link>
        </div>
      </div>
    </section>
  );
}
