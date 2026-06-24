-- Run this once in Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists app_storage (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);

-- Allow the anon key to read/write (fine for a single-user internal tool;
-- tighten this with real auth before opening the order form to the public).
alter table app_storage enable row level security;

create policy "allow anon all" on app_storage
  for all
  using (true)
  with check (true);
