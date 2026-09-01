import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const tomicicLogo = `${import.meta.env.BASE_URL}branding/tomicic-logo.jpg`;

function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`}>
      <img
        src={tomicicLogo}
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[145%] w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
      />
    </div>
  );
}

const navLinks = [
  { to: "/propiedades", label: "Propiedades" },
  { to: "/propiedades", label: "Terrenos", search: { tipo: "terreno" } },
  { to: "/propiedades", label: "Alquileres", search: { operacion: "alquiler" } },
  { to: "/contacto", label: "Contacto" },
] as const;

function Header() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-fg/5 bg-bg/80 px-6 py-4 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3">
        <Logo />
        <span className="text-xl font-extrabold uppercase tracking-tighter text-fg">Tomicic</span>
      </Link>
      <div className="hidden gap-8 text-sm font-medium uppercase tracking-widest text-fg/60 md:flex">
        {navLinks.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            search={"search" in l ? l.search : {}}
            className="transition-colors hover:text-brand-blue"
            activeProps={{ className: "text-fg" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-6 text-sm font-medium uppercase tracking-widest text-fg/60 md:hidden">
        <Link to="/propiedades" className="transition-colors hover:text-brand-blue">
          Propiedades
        </Link>
        <Link to="/contacto" className="transition-colors hover:text-brand-blue">
          Contacto
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-6 border-t border-fg/5 bg-bg px-6 py-12 md:flex-row">
      <div className="flex items-center gap-3">
        <Logo className="size-6 opacity-50" />
        <span className="text-sm font-bold uppercase tracking-tighter text-fg opacity-50">
          © 2026 Tomicic Inmobiliaria
        </span>
      </div>
      <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-fg/40">
        <a href="#" className="hover:text-fg">Instagram</a>
        <a href="#" className="hover:text-fg">LinkedIn</a>
        <a href="https://wa.me/5491145678900" className="hover:text-fg">WhatsApp</a>
      </div>
    </footer>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold tracking-tighter text-fg">404</h1>
        <p className="mt-4 text-sm text-fg/60">
          La página que buscás no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand-gray px-6 py-3 text-sm font-bold uppercase tracking-tighter text-white transition-colors hover:bg-fg"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página no pudo cargarse
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo salió mal de nuestro lado. Podés intentar de nuevo o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reintentar
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Inmobiliaria Tomicic — Propiedades, Terrenos y Alquileres" },
      {
        name: "description",
        content:
          "Inmobiliaria Tomicic: casas, terrenos y departamentos en venta y alquiler en Argentina. Asesoramiento profesional en tu próxima inversión.",
      },
      { property: "og:title", content: "Inmobiliaria Tomicic" },
      {
        property: "og:description",
        content: "Casas, terrenos y alquileres en Argentina. Asesoramiento inmobiliario profesional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: tomicicLogo, type: "image/jpeg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-bg font-display text-fg">
        <Header />
        <Outlet />
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
