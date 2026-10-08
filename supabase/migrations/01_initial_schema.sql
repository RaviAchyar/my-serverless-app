create type public.task_status as enum ('todo', 'in_progress', 'done');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null unique check (position('@' in email) > 1),
  role text not null default 'developer',
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '',
  budget numeric(12, 2) not null default 0 check (budget >= 0),
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 160),
  description text not null default '',
  status public.task_status not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  reward_xp integer not null default 0 check (reward_xp >= 0),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_profile_id_idx on public.projects using btree (profile_id);
create index tasks_project_id_idx on public.tasks using btree (project_id);
create index tasks_status_idx on public.tasks using btree (status);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "Public can read seeded profiles"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Public can read seeded projects"
on public.projects for select
to anon, authenticated
using (true);

create policy "Public can read seeded tasks"
on public.tasks for select
to anon, authenticated
using (true);

grant select on public.profiles, public.projects, public.tasks to anon, authenticated;

insert into public.profiles (id, full_name, email, role, bio)
values (
  '1d4a0000-0000-4000-8000-000000000001',
  'Alya Pratama',
  'alya.pratama@example.com',
  'Full-stack developer',
  'Membangun produk serverless yang cepat, aman, dan mudah dikembangkan.'
)
on conflict do nothing;

insert into public.projects (id, profile_id, name, slug, description, budget, status)
values
  (
    '2d4a0000-0000-4000-8000-000000000001',
    '1d4a0000-0000-4000-8000-000000000001',
    'Serverless Task Odyssey',
    'serverless-task-odyssey',
    'Aplikasi pengelolaan tugas serverless dengan Next.js, Supabase, dan alur kerja tim yang terukur.',
    12500.00,
    'active'
  ),
  (
    '2d4a0000-0000-4000-8000-000000000002',
    '1d4a0000-0000-4000-8000-000000000001',
    'Edge Analytics Platform',
    'edge-analytics-platform',
    'Pipeline analitik ringan untuk memproses aktivitas produk dengan latensi rendah di edge.',
    8400.00,
    'active'
  ),
  (
    '2d4a0000-0000-4000-8000-000000000003',
    '1d4a0000-0000-4000-8000-000000000001',
    'Community Learning Hub',
    'community-learning-hub',
    'Ruang kolaborasi pembelajaran untuk membagikan modul, progres, dan pencapaian komunitas.',
    6200.00,
    'paused'
  )
on conflict do nothing;

insert into public.tasks (
  id, project_id, title, description, status, priority, reward_xp, due_date
)
values
  (
    '3d4a0000-0000-4000-8000-000000000001',
    '2d4a0000-0000-4000-8000-000000000001',
    'Siapkan fondasi skema PostgreSQL',
    'Buat model relasional untuk profil, proyek, dan tugas beserta kebijakan akses baca.',
    'done',
    'high',
    240,
    '2026-10-15'
  ),
  (
    '3d4a0000-0000-4000-8000-000000000002',
    '2d4a0000-0000-4000-8000-000000000001',
    'Integrasikan Supabase SSR',
    'Konfigurasikan server dan browser client dengan cookie session yang kompatibel dengan App Router.',
    'in_progress',
    'high',
    320,
    '2026-10-20'
  ),
  (
    '3d4a0000-0000-4000-8000-000000000003',
    '2d4a0000-0000-4000-8000-000000000002',
    'Rancang event ingestion',
    'Definisikan kontrak event dan strategi validasi payload analitik.',
    'in_progress',
    'medium',
    180,
    '2026-10-24'
  ),
  (
    '3d4a0000-0000-4000-8000-000000000004',
    '2d4a0000-0000-4000-8000-000000000002',
    'Buat dashboard penggunaan',
    'Tampilkan metrik adopsi utama untuk membantu tim memahami penggunaan fitur.',
    'todo',
    'medium',
    220,
    '2026-10-29'
  ),
  (
    '3d4a0000-0000-4000-8000-000000000005',
    '2d4a0000-0000-4000-8000-000000000003',
    'Susun katalog materi awal',
    'Kurasi materi pembelajaran dasar dan kelompokkan berdasarkan jalur belajar.',
    'done',
    'low',
    140,
    '2026-10-12'
  ),
  (
    '3d4a0000-0000-4000-8000-000000000006',
    '2d4a0000-0000-4000-8000-000000000003',
    'Rancang profil kontributor',
    'Tentukan informasi profil, pencapaian, dan preferensi berbagi kontributor.',
    'todo',
    'low',
    160,
    '2026-11-02'
  )
on conflict do nothing;
