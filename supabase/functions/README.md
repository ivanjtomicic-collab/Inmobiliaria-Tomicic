# Automatización de consultas

1. Ejecutá `supabase/inquiries.sql` en el SQL Editor.
2. Desplegá la función `submit-inquiry` desde el panel o la CLI de Supabase.
3. Configurá los secretos `RESEND_API_KEY`, `INQUIRIES_FROM_EMAIL` e
   `INQUIRIES_TO_EMAIL`. El remitente debe estar verificado en Resend.
4. Opcionalmente configurá `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
   `WHATSAPP_SALES_PHONE` y `WHATSAPP_TEMPLATE_NAME` para la alerta interna.
5. Si usás otro dominio, agregalo a `ALLOWED_ORIGINS` (separado por comas).

La URL y la clave `service_role` son provistas automáticamente por Supabase a
las Edge Functions y nunca deben copiarse al frontend.
