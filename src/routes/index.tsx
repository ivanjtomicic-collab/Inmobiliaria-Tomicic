import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { ContactSection } from "@/components/ContactSection";
import { useProperties } from "@/lib/property-service";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inmobiliaria Tomicic — Casas, Lotes y Alquileres en Argentina" },
      {
        name: "description",
        content:
          "Encontrá casas, lotes y departamentos en venta y alquiler. Inmobiliaria Tomicic: inversiones que definen tu futuro.",
      },
      { property: "og:title", content: "Inmobiliaria Tomicic" },
      {
        property: "og:description",
        content: "Casas, lotes y alquileres en Argentina. Inversiones que definen tu futuro.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { properties, loading, error } = useProperties();
  const [tipo, setTipo] = useState<"" | "casa" | "terreno" | "alquiler">("");
  const [ubicacion, setUbicacion] = useState("");
  const featuredProperties = properties.filter((property) => property.featured);
  const featured = (featuredProperties.length ? featuredProperties : properties).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl animate-fade-up px-6 pt-20 pb-12 text-center">
        <h1 className="mb-8 text-5xl leading-[0.9] font-extrabold tracking-tight text-balance md:text-7xl">
          Inversiones que <br /> definen tu <span className="text-brand-blue">futuro.</span>
        </h1>

        <form
          className="mx-auto flex max-w-3xl flex-col gap-2 rounded-2xl bg-card p-2 text-card-foreground shadow-xl shadow-fg/5 ring-1 ring-fg/5 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({
              to: "/propiedades",
              search: {
                ...(tipo ? { tipo } : {}),
                ...(ubicacion ? { q: ubicacion } : {}),
              },
            });
          }}
        >
          <select
            aria-label="Tipo de propiedad"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "" | "casa" | "terreno" | "alquiler")}
            className="bg-transparent px-6 py-3 font-medium focus:outline-none md:border-r md:border-fg/10"
          >
            <option value="">Todo tipo</option>
            <option value="casa">Casas</option>
            <option value="terreno">Lotes</option>
            <option value="alquiler">Alquileres</option>
          </select>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ubicación en Argentina..."
            className="flex-1 bg-transparent px-6 py-3 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-gray px-8 py-3 font-bold uppercase tracking-tighter text-brand-contrast transition-all hover:bg-brand-gray/85"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* Destacadas */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-sm text-brand-blue">[ CATÁLOGO 2026 ]</p>
            <h2 className="text-3xl font-bold tracking-tight">Propiedades Destacadas</h2>
          </div>
          <Link
            to="/propiedades"
            search={{}}
            className="hidden rounded-full border border-fg/10 px-4 py-1 text-xs font-bold uppercase transition-colors hover:bg-brand-blue/10 sm:block"
          >
            Ver todas
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-center text-fg/50">Cargando propiedades...</p>
        ) : error ? (
          <p className="py-12 text-center text-red-600">No se pudo cargar el catálogo.</p>
        ) : featured.length === 0 ? (
          <p className="py-12 text-center text-fg/50">Próximamente publicaremos nuevas propiedades.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} delay={(i + 1) * 100} priority={i === 0} />
            ))}
          </div>
        )}
      </section>

      <ContactSection />
    </>
  );
}
