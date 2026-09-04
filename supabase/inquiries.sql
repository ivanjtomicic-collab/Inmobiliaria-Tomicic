-- Ejecutá este archivo una vez en Supabase > SQL Editor.
-- Crea el registro privado de consultas del sitio.

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
