-- Ejecutá este archivo una vez en Supabase > SQL Editor sobre un proyecto existente.
-- NOT VALID evita que datos históricos inválidos bloqueen la instalación; las
-- restricciones se aplican de inmediato a toda escritura nueva.

alter table public.properties
  drop constraint if exists properties_title_length;
alter table public.properties
  add constraint properties_title_length
  check (char_length(title) between 1 and 160) not valid;

alter table public.properties
  drop constraint if exists properties_price_length;
alter table public.properties
  add constraint properties_price_length
  check (char_length(price) between 1 and 80) not valid;

alter table public.properties
  drop constraint if exists properties_location_length;
alter table public.properties
  add constraint properties_location_length
  check (char_length(location) between 1 and 200) not valid;

alter table public.properties
  drop constraint if exists properties_description_length;
alter table public.properties
  add constraint properties_description_length
  check (char_length(description) between 1 and 5000) not valid;

alter table public.properties
  drop constraint if exists properties_image_url_safe;
alter table public.properties
  add constraint properties_image_url_safe
  check (
    char_length(image_url) <= 2048
    and (
      image_url like 'https://%'
      or (left(image_url, 1) = '/' and left(image_url, 2) <> '//')
    )
  ) not valid;

alter table public.properties
  drop constraint if exists properties_extras_limit;
alter table public.properties
  add constraint properties_extras_limit
  check (cardinality(extras) <= 30) not valid;

update storage.buckets
set
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'property-images';
