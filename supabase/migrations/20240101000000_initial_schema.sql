-- Create endpoints table
create table public.endpoints (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  url text not null,
  check_interval integer not null default 60,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  constraint endpoints_pkey primary key (id)
);

-- Create checks table
create table public.checks (
  id uuid not null default gen_random_uuid(),
  endpoint_id uuid not null references public.endpoints(id) on delete cascade,
  status text not null,
  response_time integer null,
  status_code integer null,
  error_message text null,
  checked_at timestamp with time zone not null default now(),
  constraint checks_pkey primary key (id)
);

-- Create notifications table
create table public.notifications (
  id uuid not null default gen_random_uuid(),
  endpoint_id uuid not null references public.endpoints(id) on delete cascade,
  notification_type text not null,
  recipient_email text not null,
  sent_at timestamp with time zone not null default now(),
  constraint notifications_pkey primary key (id)
);

-- Enable RLS
alter table public.endpoints enable row level security;
alter table public.checks enable row level security;
alter table public.notifications enable row level security;

-- RLS Policies for endpoints
create policy "Users can view their own endpoints"
  on public.endpoints for select
  using (auth.uid() = user_id);

create policy "Users can insert their own endpoints"
  on public.endpoints for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own endpoints"
  on public.endpoints for update
  using (auth.uid() = user_id);

create policy "Users can delete their own endpoints"
  on public.endpoints for delete
  using (auth.uid() = user_id);

-- RLS Policies for checks
create policy "Users can view checks for their endpoints"
  on public.checks for select
  using (
    endpoint_id in (
      select id from public.endpoints where user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
create policy "Users can view notifications for their endpoints"
  on public.notifications for select
  using (
    endpoint_id in (
      select id from public.endpoints where user_id = auth.uid()
    )
  );
