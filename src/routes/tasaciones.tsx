import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/tasaciones")({
  head: () => ({
    meta: [
      { title: "Tasaciones — Inmobiliaria Tomicic" },
      {
        name: "description",
        content: "Solicitá una tasación profesional de tu propiedad con Inmobiliaria Tomicic.",
      },
    ],
  }),
  component: TasacionesPage,
});

function TasacionesPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl animate-fade-up px-6 py-20">
        <p className="mb-3 font-mono text-sm text-brand-blue">[ TASACIONES ]</p>
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
          Conocé el valor real de tu propiedad.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg/60">
          Analizamos ubicación, características y valores actuales del mercado para brindarte una
          tasación profesional y acompañarte en tu próxima decisión inmobiliaria.
        </p>
      </section>
      <ContactSection defaultInterest="Tasaciones" />
    </>
  );
}
