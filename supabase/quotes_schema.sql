-- Create quotes table
create table public.quotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  quote_number text not null,
  date date default current_date not null,
  status text default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected')),
  items jsonb default '[]'::jsonb, -- Array of { concept, description, price, quantity }
  notes text,
  total numeric default 0,
  
  -- Constraints
  constraint quotes_quote_number_key unique (quote_number)
);

-- Enable RLS
alter table public.quotes enable row level security;

-- Policies (Assuming authenticated users can do everything for now, similar to clients)
create policy "Enable all for authenticated users" on public.quotes
  for all using (auth.role() = 'authenticated');
