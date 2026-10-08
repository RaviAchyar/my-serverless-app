import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Cloud,
  Database as DatabaseIcon,
  Layers3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectStatus } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type ConnectionState = "verified" | "not-configured" | "error";

type ProjectSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  budget: number;
  status: ProjectStatus;
};

const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "Aktif",
  paused: "Dijeda",
  completed: "Selesai",
};

const projectStatusClasses: Record<ProjectStatus, string> = {
  active:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  paused:
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  completed:
    "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

function formatBudget(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ConnectionBadge({ state }: { state: ConnectionState }) {
  if (state === "verified") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-300"
      >
        <CircleCheck className="mr-1.5 size-3.5" />
        Supabase terverifikasi
      </Badge>
    );
  }

  if (state === "not-configured") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-amber-700 dark:text-amber-300"
      >
        <CircleAlert className="mr-1.5 size-3.5" />
        Supabase belum dikonfigurasi
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="rounded-full border-destructive/25 bg-destructive/10 px-3 py-1.5 text-destructive"
    >
      <CircleAlert className="mr-1.5 size-3.5" />
      Supabase tidak dapat diakses
    </Badge>
  );
}

async function ProjectOverview() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <ProjectDashboard
        connection="not-configured"
        projects={[]}
        totalTasks={0}
        completedTasks={0}
      />
    );
  }

  const supabase = await createClient();
  const [projectsResult, tasksResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, slug, description, budget, status")
      .order("created_at", { ascending: true }),
    supabase.from("tasks").select("id, status"),
  ]);

  if (projectsResult.error || tasksResult.error) {
    return (
      <ProjectDashboard
        connection="error"
        projects={[]}
        totalTasks={0}
        completedTasks={0}
      />
    );
  }

  const tasks = tasksResult.data;

  return (
    <ProjectDashboard
      connection="verified"
      projects={projectsResult.data}
      totalTasks={tasks.length}
      completedTasks={tasks.filter((task) => task.status === "done").length}
    />
  );
}

function ProjectDashboard({
  connection,
  projects,
  totalTasks,
  completedTasks,
}: {
  connection: ConnectionState;
  projects: ProjectSummary[];
  totalTasks: number;
  completedTasks: number;
}) {
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const totalBudget = projects.reduce((total, project) => total + project.budget, 0);
  const statusMessage =
    connection === "verified"
      ? projects.length > 0
        ? "Daftar proyek tersinkron dari PostgreSQL."
        : "Koneksi berhasil, tetapi belum ada proyek. Jalankan migrasi untuk mengisi seed."
      : connection === "not-configured"
        ? "Tambahkan kredensial Supabase dan jalankan migrasi untuk memuat data proyek."
        : "Koneksi gagal. Periksa kredensial, migrasi, dan kebijakan akses baca.";

  return (
    <section aria-labelledby="database-overview-heading" className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
              <DatabaseIcon className="mr-1.5 size-3.5 text-primary" />
              Supabase PostgreSQL
            </Badge>
            <ConnectionBadge state={connection} />
          </div>
          <h2 id="database-overview-heading" className="mt-4 text-2xl font-semibold tracking-tight">
            Data proyek dari database
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{statusMessage}</p>
        </div>
        <p className="text-xs text-muted-foreground">Dibaca dari database saat halaman dimuat</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total proyek", value: projects.length, detail: `${activeProjects} proyek aktif` },
          { label: "Total tugas", value: totalTasks, detail: `${completedTasks} selesai` },
          { label: "Anggaran proyek", value: formatBudget(totalBudget), detail: "Akumulasi seluruh proyek" },
        ].map((metric) => (
          <Card key={metric.label} className="border-border/70 bg-card/80 shadow-sm backdrop-blur-sm">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-3 truncate text-2xl font-semibold tracking-tight">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card
              key={project.id}
              className="group/project border-border/70 bg-card/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover/project:scale-105">
                    <Layers3 className="size-5" />
                  </span>
                  <Badge variant="outline" className={`rounded-full ${projectStatusClasses[project.status]}`}>
                    {projectStatusLabels[project.status]}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg tracking-tight">{project.name}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3 min-h-[3.75rem] text-sm leading-5">
                    {project.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between border-t border-border/70 pt-4">
                <span className="text-xs text-muted-foreground">Project budget</span>
                <span className="text-sm font-semibold">{formatBudget(project.budget)}</span>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-border bg-card/60 md:col-span-3">
            <CardContent className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
              <DatabaseIcon className="size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">
                {connection === "verified" ? "Belum ada proyek tersimpan" : "Data proyek belum tersedia"}
              </p>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                {statusMessage}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

function ProjectOverviewFallback() {
  return (
    <section aria-label="Memuat data proyek" className="space-y-5">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_55%)]"
      />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Cloud className="size-5" />
            </span>
            <span>CloudTask <span className="text-muted-foreground">Pro</span></span>
          </Link>
          <Link
            href="/tasks"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border/70 bg-card/60 px-4 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
              Buka Dashboard Tugas
              <ArrowRight className="ml-2 size-4" />
          </Link>
        </header>

        <section className="grid items-center gap-12 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:py-8">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="rounded-full border border-border/70 bg-card/60 px-3 py-1.5 font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="mr-2 size-3.5 text-primary" />
              The Serverless Odyssey <span className="mx-2 text-border">•</span> Minggu 02
            </Badge>
            <h1 className="mt-8 text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Build with a <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">stronger foundation.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Fondasi aplikasi serverless yang menyatukan Next.js 16, Supabase PostgreSQL,
              dan skema relasional yang siap dikembangkan bersama kebutuhan produk.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/tasks"
                className="group inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                  Buka Dashboard Tugas
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-sm text-muted-foreground">Supabase SSR · PostgreSQL · TypeScript</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-border/70 pt-6">
              {[
                "UUID relational schema",
                "Foreign-key integrity",
                "Typed database access",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleCheck className="size-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden rounded-3xl border-border/70 bg-card/70 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Relational architecture</p>
                  <CardTitle className="mt-2 text-xl tracking-tight">A simple, connected core</CardTitle>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <DatabaseIcon className="size-5" />
                </span>
              </div>
              <CardDescription className="pt-2 text-sm leading-6">
                Tiga tabel inti. Relasi yang jelas. Data yang siap bertumbuh.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "profiles", detail: "Pemilik workspace", marker: "01" },
                { name: "projects", detail: "Budget & status proyek", marker: "02" },
                { name: "tasks", detail: "Prioritas & progres kerja", marker: "03" },
              ].map((table, index) => (
                <div key={table.name} className="relative flex items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4">
                  {index < 2 ? (
                    <span aria-hidden="true" className="absolute left-[2.15rem] top-full h-3 w-px bg-border" />
                  ) : null}
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {table.marker}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold">{table.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{table.detail}</p>
                  </div>
                  {index > 0 ? <span className="text-xs text-muted-foreground">FK</span> : null}
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-muted-foreground">
                profiles <span className="px-1 text-primary">1 → N</span> projects
                <span className="px-1 text-primary">1 → N</span> tasks
              </p>
            </CardContent>
          </Card>
        </section>

        <Suspense fallback={<ProjectOverviewFallback />}>
          <ProjectOverview />
        </Suspense>

        <footer className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
          The Serverless Odyssey <span className="mx-2 text-border">·</span> Dibangun dengan Next.js 16 dan Supabase
        </footer>
      </div>
    </main>
  );
}
