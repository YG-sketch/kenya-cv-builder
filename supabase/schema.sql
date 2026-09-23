create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  phone text,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text default 'My CV',
  template text default 'classic',
  data jsonb not null default '{}'::jsonb,
  is_paid boolean default false,
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid references public.cvs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  paystack_reference text unique not null,
  amount_kes integer not null default 20,
  status text not null default 'pending',
  phone text,
  created_at timestamptz default now(),
  verified_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.cvs enable row level security;
alter table public.payments enable row level security;

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Users manage own cvs" on public.cvs
  for all using (auth.uid() = user_id);

create policy "Users view own payments" on public.payments
  for select using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cvs_set_updated_at
before update on public.cvs
for each row execute function public.set_updated_at();
