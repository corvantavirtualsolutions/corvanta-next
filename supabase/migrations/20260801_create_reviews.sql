-- Create the reviews table
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  rating      smallint not null check (rating >= 1 and rating <= 5),
  feedback    text not null,
  user_name   text not null,
  company     text,
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table reviews enable row level security;

-- Allow anyone (anon + authenticated) to insert reviews
create policy "Anyone can insert reviews"
  on reviews
  for insert
  to anon, authenticated
  with check (true);

-- No public SELECT policy — reads go through the service_role key server-side only
