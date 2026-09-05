-- Ejecutá este archivo completo en Supabase > SQL Editor.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  type text not null check (type in ('casa', 'departamento', 'terreno', 'campo', 'local_comercial', 'galpon')),
  operation text not null check (operation in ('venta', 'alquiler')),
  price text not null check (char_length(price) between 1 and 80),
  location text not null check (char_length(location) between 1 and 200),
  image_url text not null check (char_length(image_url) <= 2048 and (image_url like 'https://%' or image_url like '/%')),
  surface text not null default '',
  rooms text not null default '',
  baths text not null default '',
  extras text[] not null default '{}',
  tag text not null default '',
  description text not null check (char_length(description) between 1 and 5000),
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  interest text not null check (char_length(interest) between 1 and 100),
  message text not null check (char_length(message) between 1 and 3000),
  property_id text references public.properties(id) on update cascade on delete set null,
  property_title text check (property_title is null or char_length(property_title) <= 160),
  source_url text check (source_url is null or char_length(source_url) <= 1000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Visitors can submit inquiries" on public.inquiries;
create policy "Visitors can submit inquiries"
on public.inquiries for insert
to anon, authenticated
with check (status = 'new');

drop policy if exists "Admins can view inquiries" on public.inquiries;
create policy "Admins can view inquiries"
on public.inquiries for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
on public.inquiries for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete inquiries" on public.inquiries;
create policy "Admins can delete inquiries"
on public.inquiries for delete
to authenticated
using (public.is_admin());

revoke all on public.inquiries from anon;
grant insert (first_name, last_name, email, interest, message, property_id, property_title, source_url)
on public.inquiries to anon;
grant usage, select on sequence public.inquiries_id_seq to anon;
grant select, insert, update, delete on public.inquiries to authenticated;
grant usage, select on sequence public.inquiries_id_seq to authenticated;

drop policy if exists "Admins can view themselves" on public.admin_users;
create policy "Admins can view themselves"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Visitors can view published properties" on public.properties;
create policy "Visitors can view published properties"
on public.properties for select
to anon, authenticated
using (published or public.is_admin());

drop policy if exists "Admins can insert properties" on public.properties;
create policy "Admins can insert properties"
on public.properties for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update properties" on public.properties;
create policy "Admins can update properties"
on public.properties for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete properties" on public.properties;
create policy "Admins can delete properties"
on public.properties for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public property images" on storage.objects;
create policy "Public property images"
on storage.objects for select
to public
using (bucket_id = 'property-images');

drop policy if exists "Admins can upload property images" on storage.objects;
create policy "Admins can upload property images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "Admins can update property images" on storage.objects;
create policy "Admins can update property images"
on storage.objects for update
to authenticated
using (bucket_id = 'property-images' and public.is_admin());

drop policy if exists "Admins can delete property images" on storage.objects;
create policy "Admins can delete property images"
on storage.objects for delete
to authenticated
using (bucket_id = 'property-images' and public.is_admin());

-- Después de crear tu usuario en Authentication > Users, reemplazá el email:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'TU_EMAIL@EJEMPLO.COM';
