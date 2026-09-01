import casaNordelta from "@/assets/casa-nordelta.jpg";
import terrenoBariloche from "@/assets/terreno-bariloche.jpg";
import deptoMadero from "@/assets/depto-madero.jpg";
import casaBelgrano from "@/assets/casa-belgrano.jpg";
import terrenoPilar from "@/assets/terreno-pilar.jpg";
import deptoPalermo from "@/assets/depto-palermo.jpg";

export type PropertyType = "casa" | "terreno" | "departamento";
export type Operation = "venta" | "alquiler";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  operation: Operation;
  price: string;
  location: string;
  image: string;
  surface?: string;
  rooms?: string;
  baths?: string;
  extras: string[];
  tag: string;
  description: string;
}

export const properties: Property[] = [
  {
    id: "residencia-la-isla",
    title: "Residencia La Isla",
    type: "casa",
    operation: "venta",
    price: "USD 850.000",
    location: "Nordelta, Tigre, Buenos Aires",
    image: casaNordelta,
    surface: "450 m²",
    rooms: "5 Amb.",
    baths: "4 Baños",
    extras: ["Piscina", "Quincho", "Cochera doble", "Seguridad 24hs"],
    tag: "Casa • Venta",
    description:
      "Casa minimalista de diseño contemporáneo sobre lote al lago. Amplios ventanales con luz natural todo el día, living-comedor de doble altura, cocina integrada y galería con parrilla. Terminaciones de primer nivel.",
  },
  {
    id: "lote-cerro-catedral",
    title: "Lote Cerro Catedral",
    type: "terreno",
    operation: "venta",
    price: "USD 125.000",
    location: "Bariloche, Río Negro",
    image: terrenoBariloche,
    surface: "2.500 m²",
    extras: ["Servicios", "Escritura inmediata", "Vista a la montaña"],
    tag: "Terreno • Oportunidad",
    description:
      "Terreno plano con vista abierta a la cordillera, a minutos del centro de Bariloche. Todos los servicios en la puerta: agua, luz, gas y cloacas. Escritura inmediata, ideal para proyecto residencial o inversión.",
  },
  {
    id: "torre-madero-view",
    title: "Torre Madero View",
    type: "departamento",
    operation: "alquiler",
    price: "ARS 1.200.000 / mes",
    location: "Puerto Madero, CABA",
    image: deptoMadero,
    surface: "120 m²",
    rooms: "3 Amb.",
    baths: "2 Baños",
    extras: ["Cochera", "Balcón terraza", "Amenities", "Baulera"],
    tag: "Departamento • Alquiler",
    description:
      "Departamento en piso alto con balcón aterrazado y vista panorámica al dique. Edificio con amenities completos: pileta, gimnasio, SUM y seguridad 24hs. Contrato de alquiler tradicional.",
  },
  {
    id: "chalet-belgrano",
    title: "Chalet Belgrano R",
    type: "casa",
    operation: "venta",
    price: "USD 620.000",
    location: "Belgrano R, CABA",
    image: casaBelgrano,
    surface: "310 m²",
    rooms: "6 Amb.",
    baths: "3 Baños",
    extras: ["Jardín", "Parrilla", "Cochera", "Reciclado a nuevo"],
    tag: "Casa • Venta",
    description:
      "Chalet clásico reciclado a nuevo en uno de los barrios más arbolados de la ciudad. Frente imponente, jardín propio, dependencia de servicio y altura libre de 3,20 m en planta baja.",
  },
  {
    id: "lote-los-olmos",
    title: "Lote Los Olmos",
    type: "terreno",
    operation: "venta",
    price: "USD 68.000",
    location: "Del Viso, Pilar, Buenos Aires",
    image: terrenoPilar,
    surface: "840 m²",
    extras: ["Barrio cerrado", "Servicios", "Expensas bajas"],
    tag: "Terreno • Venta",
    description:
      "Lote interno en barrio cerrado consolidado de la zona norte. Entorno arbolado, seguridad permanente y expensas bajas. Apto para construir de inmediato con todos los servicios disponibles.",
  },
  {
    id: "estudio-palermo",
    title: "Estudio Palermo Soho",
    type: "departamento",
    operation: "alquiler",
    price: "ARS 680.000 / mes",
    location: "Palermo Soho, CABA",
    image: deptoPalermo,
    surface: "48 m²",
    rooms: "2 Amb.",
    baths: "1 Baño",
    extras: ["Amoblado", "Balcón", "Luminoso"],
    tag: "Departamento • Alquiler",
    description:
      "Monoambiente divisible totalmente amoblado, con pisos de madera, balcón al frente y excelente luminosidad. Ubicación inmejorable en el corazón de Palermo Soho, cerca de plazas, gastronomía y transporte.",
  },
];

export const getProperty = (id: string) => properties.find((p) => p.id === id);
