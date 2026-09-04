import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/properties";

export function PropertyCard({
  property,
  delay = 0,
  priority = false,
}: {
  property: Property;
  delay?: number;
  priority?: boolean;
}) {
  return (
    <Link
      to="/propiedad/$id"
      params={{ id: property.id }}
      className="group block animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-fg/5 bg-brand-gray/5">
        <img
          src={property.image}
          alt={property.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          width={1200}
          height={1500}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 rounded-full bg-bg/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg backdrop-blur-sm">
          {property.tag}
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight text-fg">{property.title}</h3>
          <span className="shrink-0 font-mono font-bold text-brand-blue-text">
            {property.price}
          </span>
        </div>
        <p className="text-sm text-fg/60">{property.location}</p>
        <div className="flex flex-wrap gap-4 pt-3 font-mono text-[11px] text-fg/40">
          {property.surface && <span>{property.surface}</span>}
          {property.rooms && <span>{property.rooms}</span>}
          {property.baths && <span>{property.baths}</span>}
          {!property.rooms && property.extras.slice(0, 2).map((e) => <span key={e}>{e}</span>)}
        </div>
      </div>
    </Link>
  );
}
