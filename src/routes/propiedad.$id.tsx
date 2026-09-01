import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProperty } from "@/lib/properties";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/propiedad/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return property;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Inmobiliaria Tomicic` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.title} — Inmobiliaria Tomicic` },
          { property: "og:description", content: loaderData.description },
        ]
      : [
          { title: "Propiedad no encontrada — Inmobiliaria Tomicic" },
          { name: "robots", content: "noindex" },
        ],
  }),
  component: PropiedadDetalle,
});

function PropiedadDetalle() {
  const property = Route.useLoaderData();

  const specs = [
    property.surface && { label: "Superficie", value: property.surface },
    property.rooms && { label: "Ambientes", value: property.rooms },
    property.baths && { label: "Baños", value: property.baths },
    { label: "Operación", value: property.operation === "venta" ? "Venta" : "Alquiler" },
    { label: "Tipo", value: property.type },
    { label: "Ubicación", value: property.location },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          to="/propiedades"
          search={{}}
          className="font-mono text-xs text-fg/40 transition-colors hover:text-fg"
        >
          ← Volver al catálogo
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-fg/5 bg-brand-gray/5">
            <img
              src={property.image}
              alt={property.title}
              width={1200}
              height={1500}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg backdrop-blur-sm">
              {property.tag}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-2 font-mono text-sm text-brand-blue">
              [ {property.operation.toUpperCase()} ]
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              {property.title}
            </h1>
            <p className="mt-2 text-lg text-fg/60">{property.location}</p>
            <p className="mt-6 font-mono text-3xl font-bold text-fg">{property.price}</p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-fg/10 bg-fg/10 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="bg-bg p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-fg/40">
                    {s.label}
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold capitalize">{s.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 leading-relaxed text-fg/70">{property.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {property.extras.map((e) => (
                <span
                  key={e}
                  className="rounded-full border border-fg/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-fg/60"
                >
                  {e}
                </span>
              ))}
            </div>

            <a
              href="#contacto"
              className="mt-10 inline-flex w-fit items-center justify-center rounded-xl bg-brand-blue px-10 py-4 font-bold uppercase tracking-tighter text-fg transition-all hover:bg-brand-blue/80"
            >
              Consultar por esta propiedad
            </a>
          </div>
        </div>
      </section>

      <ContactSection propertyTitle={property.title} />
    </>
  );
}
