drop table if exists public.app_preferences;
drop table if exists public.app_transactions;
drop table if exists public.app_categories;

create table public.app_categories (
  owner_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  type text not null,
  name text not null,
  emoji text not null,
  is_default boolean not null default false,
  label_key text,
  created_at timestamptz not null,
  primary key (owner_id, id)
);

create table public.app_transactions (
  owner_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  type text not null,
  amount text not null,
  description text not null,
  category_id text not null,
  date timestamptz not null,
  category_json jsonb,
  primary key (owner_id, id)
);

create table public.app_preferences (
  owner_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value text not null,
  primary key (owner_id, key)
);

alter table public.app_categories enable row level security;
alter table public.app_transactions enable row level security;
alter table public.app_preferences enable row level security;

revoke all on public.app_categories from anon;
revoke all on public.app_transactions from anon;
revoke all on public.app_preferences from anon;

grant select, insert, update, delete on public.app_categories to authenticated;
grant select, insert, update, delete on public.app_transactions to authenticated;
grant select, insert, update, delete on public.app_preferences to authenticated;

drop policy if exists "categories_select_own" on public.app_categories;
create policy "categories_select_own"
on public.app_categories
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "categories_insert_own" on public.app_categories;
create policy "categories_insert_own"
on public.app_categories
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "categories_update_own" on public.app_categories;
create policy "categories_update_own"
on public.app_categories
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "categories_delete_own" on public.app_categories;
create policy "categories_delete_own"
on public.app_categories
for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "transactions_select_own" on public.app_transactions;
create policy "transactions_select_own"
on public.app_transactions
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "transactions_insert_own" on public.app_transactions;
create policy "transactions_insert_own"
on public.app_transactions
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "transactions_update_own" on public.app_transactions;
create policy "transactions_update_own"
on public.app_transactions
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "transactions_delete_own" on public.app_transactions;
create policy "transactions_delete_own"
on public.app_transactions
for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "preferences_select_own" on public.app_preferences;
create policy "preferences_select_own"
on public.app_preferences
for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "preferences_insert_own" on public.app_preferences;
create policy "preferences_insert_own"
on public.app_preferences
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "preferences_update_own" on public.app_preferences;
create policy "preferences_update_own"
on public.app_preferences
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "preferences_delete_own" on public.app_preferences;
create policy "preferences_delete_own"
on public.app_preferences
for delete
to authenticated
using (owner_id = auth.uid());
