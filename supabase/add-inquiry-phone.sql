-- Ejecutá en Supabase > SQL Editor antes de desplegar el formulario y submit-inquiry.
begin;

alter table public.inquiries add column if not exists phone text;

-- NOT VALID conserva las consultas anteriores sin teléfono.
-- La restricción se aplica a las nuevas inserciones y actualizaciones.
alter table public.inquiries drop constraint if exists inquiries_phone_check;
alter table public.inquiries add constraint inquiries_phone_check
  check (phone is not null and char_length(btrim(phone)) between 1 and 50) not valid;

grant insert (phone) on public.inquiries to anon;

commit;
