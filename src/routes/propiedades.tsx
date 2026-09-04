import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/lib/property-service";

const searchSchema = z.object({
  tipo: z.enum(["casa", "terreno", "departamento", "alquiler"]).optional(),
  operacion: z.enum(["venta", "alquiler"]).optional(),
  q: z.string().trim().max(100).optional(),
});

export const Route = createFileRoute("/propiedades")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Propiedades disponibles — Inmobiliaria Tomicic" },
      {
        name: "description",
        content:
          "Catálogo completo de casas, lotes y departamentos en venta y alquiler. Filtrá por tipo, operación y ubicación.",
      },
      { property: "og:title", content: "Propiedades — Inmobiliaria Tomicic" },
      {
        property: "og:description",
        content: "Catálogo de casas, lotes y alquileres disponibles en Argentina.",
      },
    ],
  }),
  component: PropiedadesPage,
});

const tipoFilters = [
  { value: undefined, label: "Todas" },
  { value: "casa", label: "Casas" },
  { value: "terreno", label: "Lotes" },
  { value: "alquiler", label: "Alquileres" },
] as const;

function PropiedadesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { properties, loading, error } = useProperties();

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (search.tipo === "alquiler" && p.operation !== "alquiler") return false;
      if (search.tipo && search.tipo !== "alquiler" && p.type !== search.tipo) return false;
      if (search.operacion && p.operation !== search.operacion) return false;
      if (search.q) {
        const q = search.q.toLowerCase();
        const hay = `${p.title} ${p.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="mb-2 font-mono text-sm text-brand-blue">[ CATÁLOGO 2026 ]</p>
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight md:text-5xl">
        Propiedades disponibles
      </h1>

      <div className="mb-12 flex flex-wrap items-center gap-2">
        {tipoFilters.map((f) => {
          const active =
            f.value === search.tipo || (f.value === undefined && search.tipo === undefined);
          return (
            <button
              key={f.label}
              onClick={() =>
                navigate({ search: { ...search, tipo: f.value }, replace: true })
              }
              className={`rounded-full border border-fg/10 px-4 py-1 text-xs font-bold uppercase transition-colors ${
                active ? "bg-fg text-bg" : "hover:bg-brand-blue/10"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        {search.q && (
          <span className="ml-2 rounded-full bg-brand-blue/20 px-4 py-1 text-xs font-bold uppercase">
            "{search.q}"
            <button
              className="ml-2"
              aria-label="Quitar filtro de ubicación"
              onClick={() => navigate({ search: { ...search, q: undefined }, replace: true })}
            >
              ×
            </button>
          </span>
        )}
      </div>

      {loading ? (
        <p className="py-20 text-center text-fg/50">Cargando propiedades...</p>
      ) : error ? (
        <p className="py-20 text-center text-red-600">No se pudo cargar el catálogo.</p>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-fg/50">
          No encontramos propiedades con esos filtros. Probá con otra búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} delay={i * 80} priority={i === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
