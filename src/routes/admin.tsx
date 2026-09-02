import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
  deleteProperty,
  importFallbackProperties,
  saveProperty,
  uploadPropertyImage,
  useProperties,
  type PropertyInput,
} from "@/lib/property-service";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administración — Inmobiliaria Tomicic" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const emptyProperty: PropertyInput = {
  id: "",
  title: "",
  type: "casa",
  operation: "venta",
  price: "",
  location: "",
  image: "",
  surface: "",
  rooms: "",
  baths: "",
  extras: [],
  tag: "",
  description: "",
  featured: false,
  published: true,
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <SupabaseSetupNotice />;
  if (checkingSession) return <AdminMessage>Cargando acceso...</AdminMessage>;
  if (!session) return <LoginForm />;
  return <PropertyManager email={session.user.email ?? "Administrador"} />;
}

function SupabaseSetupNotice() {
  return (
    <AdminMessage>
      <h1 className="text-3xl font-extrabold">Falta conectar Supabase</h1>
      <p className="mt-3 text-fg/60">
        Configurá <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> para habilitar el panel.
      </p>
    </AdminMessage>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error("Email o contraseña incorrectos.");
  };

  return (
    <AdminMessage>
      <form onSubmit={login} className="mx-auto max-w-md rounded-3xl bg-card p-8 text-card-foreground shadow-xl">
        <p className="font-mono text-xs text-brand-blue">[ ACCESO PRIVADO ]</p>
        <h1 className="mt-2 text-3xl font-extrabold">Administrar propiedades</h1>
        <label className="mt-8 block text-xs font-bold uppercase">Email</label>
        <input className="mt-2 w-full rounded-xl border p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="mt-4 block text-xs font-bold uppercase">Contraseña</label>
        <input className="mt-2 w-full rounded-xl border p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-fg py-3 font-bold text-white disabled:opacity-50">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </AdminMessage>
  );
}

function PropertyManager({ email }: { email: string }) {
  const { properties, loading, error, reload } = useProperties(true);
  const [form, setForm] = useState<PropertyInput>(emptyProperty);
  const [originalId, setOriginalId] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const reset = () => {
    setForm(emptyProperty);
    setOriginalId(undefined);
  };

  const edit = (property: (typeof properties)[number]) => {
    setOriginalId(property.id);
    setForm({
      id: property.id,
      title: property.title,
      type: property.type,
      operation: property.operation,
      price: property.price,
      location: property.location,
      image: property.image,
      surface: property.surface ?? "",
      rooms: property.rooms ?? "",
      baths: property.baths ?? "",
      extras: property.extras,
      tag: property.tag,
      description: property.description,
      featured: property.featured,
      published: property.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, id: form.id || slugify(form.title) };
    if (!payload.id || !payload.image) {
      toast.error("Completá el título y agregá una imagen.");
      return;
    }
    setSaving(true);
    try {
      await saveProperty(payload, originalId);
      toast.success(originalId ? "Propiedad actualizada." : "Propiedad creada.");
      reset();
      await reload();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("¿Eliminar esta propiedad definitivamente?")) return;
    try {
      await deleteProperty(id);
      toast.success("Propiedad eliminada.");
      await reload();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo eliminar.");
    }
  };

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      update("image", await uploadPropertyImage(file));
      toast.success("Imagen subida.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const importCatalog = async () => {
    setSaving(true);
    try {
      await importFallbackProperties();
      toast.success("Catálogo inicial importado.");
      await reload();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "No se pudo importar el catálogo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div><p className="font-mono text-xs text-brand-blue">[ PANEL PRIVADO ]</p><h1 className="text-4xl font-extrabold">Propiedades</h1><p className="text-sm text-fg/50">{email}</p></div>
        <div className="flex gap-3"><Link to="/" className="rounded-xl border px-4 py-2">Ver sitio</Link><button onClick={() => void supabase?.auth.signOut()} className="rounded-xl bg-fg px-4 py-2 text-white">Cerrar sesión</button></div>
      </div>

      <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-card p-6 text-card-foreground shadow-sm md:grid-cols-2">
        <h2 className="md:col-span-2 text-2xl font-bold">{originalId ? "Editar propiedad" : "Agregar propiedad"}</h2>
        <Field label="Título"><input value={form.title} onChange={(e) => { update("title", e.target.value); if (!originalId) update("id", slugify(e.target.value)); }} required /></Field>
        <Field label="Identificador URL"><input value={form.id} onChange={(e) => update("id", slugify(e.target.value))} required /></Field>
        <Field label="Tipo"><select value={form.type} onChange={(e) => update("type", e.target.value as PropertyInput["type"])}><option value="casa">Casa</option><option value="terreno">Lote</option><option value="departamento">Departamento</option></select></Field>
        <Field label="Operación"><select value={form.operation} onChange={(e) => update("operation", e.target.value as PropertyInput["operation"])}><option value="venta">Venta</option><option value="alquiler">Alquiler</option></select></Field>
        <Field label="Precio"><input value={form.price} onChange={(e) => update("price", e.target.value)} required placeholder="USD 150.000" /></Field>
        <Field label="Ubicación"><input value={form.location} onChange={(e) => update("location", e.target.value)} required /></Field>
        <Field label="Superficie"><input value={form.surface} onChange={(e) => update("surface", e.target.value)} placeholder="120 m²" /></Field>
        <Field label="Ambientes"><input value={form.rooms} onChange={(e) => update("rooms", e.target.value)} placeholder="4 Amb." /></Field>
        <Field label="Baños"><input value={form.baths} onChange={(e) => update("baths", e.target.value)} placeholder="2 Baños" /></Field>
        <Field label="Etiqueta"><input value={form.tag} onChange={(e) => update("tag", e.target.value)} placeholder="Casa • Venta" /></Field>
        <Field label="Extras (separados por coma)"><input value={form.extras.join(", ")} onChange={(e) => update("extras", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} /></Field>
        <Field label="URL de imagen"><input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." /></Field>
        <Field label="Subir imagen"><input type="file" accept="image/*" disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} /></Field>
        <Field label="Descripción" wide><textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} required /></Field>
        <div className="flex flex-wrap gap-6 md:col-span-2"><label><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> <span className="ml-2">Destacada</span></label><label><input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> <span className="ml-2">Publicada</span></label></div>
        <div className="flex gap-3 md:col-span-2"><button disabled={saving || uploading} className="rounded-xl bg-brand-blue px-6 py-3 font-bold disabled:opacity-50">{saving ? "Guardando..." : "Guardar propiedad"}</button>{originalId && <button type="button" onClick={reset} className="rounded-xl border px-6 py-3">Cancelar</button>}</div>
      </form>

      <section className="mt-12"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Publicaciones ({properties.length})</h2>{!loading && properties.length === 0 && <button disabled={saving} onClick={() => void importCatalog()} className="rounded-xl bg-brand-blue px-4 py-2 font-bold disabled:opacity-50">Importar catálogo inicial</button>}</div>{loading && <p>Cargando...</p>}{error && <p className="text-red-600">{error}</p>}<div className="grid gap-4">{properties.map((property) => <article key={property.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-4 text-card-foreground sm:flex-row sm:items-center"><img src={property.image} alt="" className="h-24 w-32 rounded-xl object-cover" /><div className="min-w-0 flex-1"><h3 className="font-bold">{property.title}</h3><p className="text-sm text-fg/60">{property.location} · {property.price}</p><p className="mt-1 text-xs uppercase text-fg/40">{property.published ? "Publicada" : "Borrador"}</p></div><div className="flex gap-2"><button onClick={() => edit(property)} className="rounded-xl border px-4 py-2">Editar</button><button onClick={() => void remove(property.id)} className="rounded-xl border border-red-200 px-4 py-2 text-red-600">Eliminar</button></div></article>)}</div></section>
    </main>
  );
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactElement }) {
  return <label className={wide ? "md:col-span-2" : ""}><span className="mb-2 block text-xs font-bold uppercase text-fg/50">{label}</span><div className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:p-3 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:p-3 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:p-3">{children}</div></label>;
}

function AdminMessage({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[70vh] bg-bg px-6 py-24 text-center">{children}</main>;
}
