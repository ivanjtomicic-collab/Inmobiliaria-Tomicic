import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";
import { useProperties } from "@/lib/property-service";

export const Route = createFileRoute("/propiedad/$id")({
  head: () => ({
    meta: [{ title: "Detalle de propiedad — Inmobiliaria Tomicic" }],
  }),
  component: PropiedadDetalle,
});

function PropiedadDetalle() {
  const { id } = Route.useParams();
  const { properties, loading, error } = useProperties();
  const property = properties.find((item) => item.id === id);

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-24 text-center text-fg/50">Cargando propiedad...</p>;
  }

  if (error || !property) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold">Propiedad no encontrada</h1>
        <p className="mt-4 text-fg/60">La publicación no existe o ya no está disponible.</p>
        <Link
          to="/propiedades"
          search={{}}
          className="mt-8 inline-block rounded-xl bg-fg px-6 py-3 text-bg"
        >
          Ver propiedades
        </Link>
      </section>
    );
  }

  const specs = [
    property.surface && { label: "Superficie", value: property.surface },
    property.rooms && { label: "Ambientes", value: property.rooms },
    property.baths && { label: "Baños", value: property.baths },
    { label: "Operación", value: property.operation === "venta" ? "Venta" : "Alquiler" },
    { label: "Tipo", value: property.type === "terreno" ? "lote" : property.type },
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
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 rounded-full bg-bg/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg backdrop-blur-sm">
              {property.tag}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-2 font-mono text-sm text-brand-blue-text">
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

      <ContactSection propertyId={property.id} propertyTitle={property.title} />
    </>
  );
}
