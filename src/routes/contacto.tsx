import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Inmobiliaria Tomicic" },
      {
        name: "description",
        content:
          "Contactá a Inmobiliaria Tomicic para comprar, vender o alquilar tu propiedad. Asesoramiento inmobiliario profesional en Argentina.",
      },
      { property: "og:title", content: "Contacto — Inmobiliaria Tomicic" },
      {
        property: "og:description",
        content: "Hablá con nuestro equipo de expertos en Real Estate.",
      },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <div className="pt-8">
      <ContactSection />
    </div>
  );
}
