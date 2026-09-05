-- Ejecutá este archivo en Supabase > SQL Editor para admitir propiedades tipo galpón.

alter table public.properties
  drop constraint if exists properties_type_check;

alter table public.properties
  add constraint properties_type_check
  check (type in ('casa', 'terreno', 'departamento', 'galpon'));
