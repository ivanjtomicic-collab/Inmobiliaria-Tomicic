// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const githubPagesBase = process.env["GITHUB_ACTIONS"]
  ? "/Inmobiliaria-Tomicic/"
  : "/";

const propertyIds = [
  "residencia-la-isla",
  "lote-cerro-catedral",
  "torre-madero-view",
  "chalet-belgrano",
  "lote-los-olmos",
  "estudio-palermo",
];

const pagePath = (path = "") => `${githubPagesBase}${path}`;

export default defineConfig({
  vite: {
    base: githubPagesBase,
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    prerender: {
      enabled: true,
      crawlLinks: false,
      failOnError: true,
      autoStaticPathsDiscovery: false,
    },
    pages: [
      { path: pagePath() },
      { path: pagePath("propiedades") },
      { path: pagePath("contacto") },
      { path: pagePath("admin") },
      ...propertyIds.map((id) => ({ path: pagePath(`propiedad/${id}`) })),
    ],
  },
});
