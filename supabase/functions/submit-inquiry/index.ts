import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200, origin = "") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });

const allowedOrigin = (origin: string) => {
  const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return (
    configured.includes(origin) ||
    origin === "https://ivanjtomicic-collab.github.io" ||
    /^http:\/\/localhost:\d+$/.test(origin)
  );
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  );

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin") ?? "";
  if (request.method === "OPTIONS") {
    return allowedOrigin(origin) ? new Response("ok", { headers: { ...corsHeaders, "Access-Control-Allow-Origin": origin } }) : json({ error: "Origen no permitido" }, 403);
  }
  if (request.method !== "POST" || !allowedOrigin(origin)) {
    return json({ error: "Solicitud no permitida" }, 403, origin);
  }

  try {
    const body = await request.json();
    if (clean(body.website, 200)) return json({ ok: true, emailSent: false }, 200, origin);

    const firstName = clean(body.firstName, 100);
    const lastName = clean(body.lastName, 100);
    const email = clean(body.email, 254).toLowerCase();
    const interest = clean(body.interest, 100);
    const message = clean(body.message, 3000);
    const propertyId = clean(body.propertyId, 120) || null;
    const propertyTitle = clean(body.propertyTitle, 160) || null;

    if (
      !firstName ||
      !lastName ||
      !interest ||
      !message ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return json({ error: "Datos inválidos" }, 400, origin);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error: insertError } = await supabase.from("inquiries").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      interest,
      message,
      property_id: propertyId,
      property_title: propertyTitle,
      source_url: request.headers.get("Referer")?.slice(0, 1000) ?? null,
    });
    if (insertError) throw insertError;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("INQUIRIES_FROM_EMAIL");
    const salesEmail = Deno.env.get("INQUIRIES_TO_EMAIL") ?? "inmobiliariatomicic@gmail.com";
    let emailSent = false;

    if (resendKey && fromEmail) {
      const safeName = escapeHtml(`${firstName} ${lastName}`);
      const safeInterest = escapeHtml(interest);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
      const safeProperty = escapeHtml(propertyTitle ?? "Consulta general");
      const headers = { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" };

      const results = await Promise.allSettled([
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: "Recibimos tu consulta — Tomicic Negocios Inmobiliarios",
            html: `<p>Hola ${escapeHtml(firstName)},</p><p>Recibimos tu consulta por <strong>${safeProperty}</strong>. Nuestro equipo se comunicará con vos a la brevedad.</p><p>Gracias por confiar en Tomicic Negocios Inmobiliarios.</p>`,
          }),
        }),
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: fromEmail,
            to: [salesEmail],
            reply_to: email,
            subject: `${safeInterest} - Consulta de ${safeName}`,
            html: `<h2>Nueva consulta inmobiliaria</h2><p><strong>Cliente:</strong> ${safeName}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Interés:</strong> ${safeInterest}<br><strong>Propiedad:</strong> ${safeProperty}</p><p><strong>Mensaje:</strong><br>${safeMessage}</p>`,
          }),
        }),
      ]);
      emailSent = results[0].status === "fulfilled" && results[0].value.ok;
    }

    const whatsappToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    const salesPhone = Deno.env.get("WHATSAPP_SALES_PHONE");
    const templateName = Deno.env.get("WHATSAPP_TEMPLATE_NAME");
    if (whatsappToken && phoneNumberId && salesPhone && templateName) {
      await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${whatsappToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: salesPhone,
          type: "template",
          template: {
            name: templateName,
            language: { code: "es_AR" },
            components: [{ type: "body", parameters: [firstName, lastName, propertyTitle ?? interest, email].map((text) => ({ type: "text", text })) }],
          },
        }),
      }).catch(() => undefined);
    }

    return json({ ok: true, emailSent }, 200, origin);
  } catch (error) {
    console.error(error);
    return json({ error: "No se pudo procesar la consulta" }, 500, origin);
  }
});
