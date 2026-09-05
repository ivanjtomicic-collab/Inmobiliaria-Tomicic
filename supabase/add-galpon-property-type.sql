-- Ejecutá este archivo en Supabase > SQL Editor para admitir los nuevos tipos de propiedad.

alter table public.properties
  drop constraint if exists properties_type_check;

alter table public.properties
  add constraint properties_type_check
  check (type in ('casa', 'departamento', 'terreno', 'campo', 'local_comercial', 'galpon'));
