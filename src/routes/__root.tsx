import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Facebook, Instagram, Mail } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { WhatsAppButton } from "../components/WhatsAppButton";

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
  { to: "/propiedades", label: "Lotes", search: { tipo: "terreno" } },
  { to: "/propiedades", label: "Alquileres", search: { operacion: "alquiler" } },
  { to: "/tasaciones", label: "Tasaciones" },
  { to: "/acerca-de", label: "Acerca de" },
  { to: "/contacto", label: "Contacto" },
] as const;

function Header() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-fg/5 bg-bg/80 px-6 py-4 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3">
        <Logo />
        <span className="text-xl font-extrabold uppercase tracking-tighter text-fg">Tomicic</span>
      </Link>
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="hidden gap-8 text-sm font-medium uppercase tracking-widest text-fg/60 lg:flex">
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
        <details className="group relative lg:hidden">
          <summary className="cursor-pointer list-none text-xs font-medium uppercase tracking-widest text-fg/60">
            Menú
          </summary>
          <div className="absolute top-8 right-0 flex max-h-[calc(100vh-6rem)] w-52 flex-col overflow-y-auto rounded-2xl bg-bg p-3 text-xs font-medium uppercase tracking-widest text-fg shadow-xl ring-1 ring-fg/10">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                search={"search" in l ? l.search : {}}
                className="rounded-lg px-3 py-3 transition-colors hover:bg-brand-blue/10"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </details>
        <ThemeToggle />
      </div>
    </nav>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("tomicic-theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 shrink-0 place-items-center rounded-full border border-fg/10 text-fg transition-colors hover:bg-fg/5"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}

function Footer() {
  return (
    <footer className="grid grid-cols-1 items-center gap-6 border-t border-fg/5 bg-bg px-6 py-12 md:grid-cols-3">
      <div className="flex items-center gap-3">
        <Logo className="size-6 opacity-50" />
        <span className="text-sm font-bold uppercase tracking-tighter text-fg opacity-50">
          © 2026 Tomicic Inmobiliaria
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-fg/40">
        <a
          href="https://www.instagram.com/tomicicnegociosinmobiliarios/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 hover:text-fg"
        >
          <Instagram className="size-4" aria-hidden="true" />
          Instagram
        </a>
        <a
          href="https://www.facebook.com/search/top?q=tomicic%20negocios%20inmobiliarios&locale=es_LA"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 hover:text-fg"
        >
          <Facebook className="size-4" aria-hidden="true" />
          Facebook
        </a>
        <a
          href="mailto:inmobiliariatomicic@gmail.com"
          className="inline-flex items-center gap-2 hover:text-fg"
        >
          <Mail className="size-4" aria-hidden="true" />
          inmobiliariatomicic@gmail.com
        </a>
      </div>
      <div aria-hidden="true" className="hidden md:block" />
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
            className="inline-flex items-center justify-center rounded-xl bg-brand-gray px-6 py-3 text-sm font-bold uppercase tracking-tighter text-brand-contrast transition-colors hover:bg-brand-gray/85"
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

export const Route = createRootRouteWithContext<Record<string, never>>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        httpEquiv: "Content-Security-Policy",
        content:
          "default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; upgrade-insecure-requests",
      },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      { title: "Inmobiliaria Tomicic — Propiedades, Lotes y Alquileres" },
      {
        name: "description",
        content:
          "Inmobiliaria Tomicic: casas, lotes y departamentos en venta y alquiler en Argentina. Asesoramiento profesional en tu próxima inversión.",
      },
      { property: "og:title", content: "Inmobiliaria Tomicic" },
      {
        property: "og:description",
        content: "Casas, lotes y alquileres en Argentina. Asesoramiento inmobiliario profesional.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("tomicic-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
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
  return (
    <>
      <div className="flex min-h-screen flex-col bg-bg font-display text-fg">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
      <Toaster />
    </>
  );
}
