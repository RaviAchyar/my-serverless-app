import { Suspense } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleDashed,
  ClipboardList,
  Clock3,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskStatusFilter, type TaskStatusFilterValue } from "@/components/task-status-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type TaskStatus = "in-progress" | "completed";

type Task = {
  id: string;
  title: string;
  description: string;
  team: string;
  status: TaskStatus;
  rewardXp: number;
  progress: number;
  updated: string;
};

const tasks: Task[] = [
  {
    id: "1",
    title: "Launch readiness review",
    description: "Review release checklist, ownership, and final platform readiness before launch.",
    team: "Platform team",
    status: "in-progress",
    rewardXp: 240,
    progress: 72,
    updated: "Diubah 12 menit lalu",
  },
  {
    id: "2",
    title: "Refactor API gateway",
    description: "Simplify request routing and improve observability across serverless endpoints.",
    team: "Infrastructure",
    status: "completed",
    rewardXp: 320,
    progress: 100,
    updated: "Selesai hari ini",
  },
  {
    id: "3",
    title: "Onboarding experience audit",
    description: "Map the first-session journey and identify friction points in team onboarding.",
    team: "Product design",
    status: "in-progress",
    rewardXp: 180,
    progress: 48,
    updated: "Diubah 1 jam lalu",
  },
  {
    id: "4",
    title: "Design system foundations",
    description: "Document semantic color tokens, component patterns, and accessibility guidance.",
    team: "Experience",
    status: "completed",
    rewardXp: 280,
    progress: 100,
    updated: "Selesai kemarin",
  },
  {
    id: "5",
    title: "Usage analytics pipeline",
    description: "Prepare a resilient event pipeline for workspace activity and usage reporting.",
    team: "Data platform",
    status: "in-progress",
    rewardXp: 360,
    progress: 64,
    updated: "Diubah 3 jam lalu",
  },
  {
    id: "6",
    title: "Workspace access controls",
    description: "Align role-based permissions with the needs of distributed project teams.",
    team: "Security",
    status: "completed",
    rewardXp: 300,
    progress: 100,
    updated: "Selesai 2 hari lalu",
  },
];

const statusLabels: Record<TaskStatus, string> = {
  "in-progress": "Berjalan",
  completed: "Selesai",
};

const statusClasses: Record<TaskStatus, string> = {
  "in-progress":
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  completed:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const metricCards = [
  {
    label: "Total tugas",
    value: tasks.length,
    percentage: "100%",
    note: "cakupan workspace",
    icon: ClipboardList,
    tone: "indigo",
    change: "up",
  },
  {
    label: "Sedang berjalan",
    value: tasks.filter((task) => task.status === "in-progress").length,
    percentage: "50%",
    note: "dari seluruh tugas",
    icon: CircleDashed,
    tone: "amber",
    change: "up",
  },
  {
    label: "Selesai",
    value: tasks.filter((task) => task.status === "completed").length,
    percentage: "50%",
    note: "tingkat penyelesaian",
    icon: Check,
    tone: "emerald",
    change: "down",
  },
] as const;

const metricToneClasses = {
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
    glow: "from-indigo-500/10",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    glow: "from-amber-500/10",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    glow: "from-emerald-500/10",
  },
} as const;

function isTaskStatusFilter(value: string | undefined): value is TaskStatusFilterValue {
  return value === "all" || value === "running" || value === "completed";
}

async function TaskListSection({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = isTaskStatusFilter(params.status) ? params.status : "all";
  const filteredTasks =
    activeFilter === "running"
      ? tasks.filter((task) => task.status === "in-progress")
      : activeFilter === "completed"
        ? tasks.filter((task) => task.status === "completed")
        : tasks;

  const counts: Record<TaskStatusFilterValue, number> = {
    all: tasks.length,
    running: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  return (
    <section aria-labelledby="tasks-heading" className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 id="tasks-heading" className="text-xl font-semibold tracking-tight">Semua pekerjaan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Daftar tugas terbaru dari workspace Anda.</p>
        </div>
        <TaskStatusFilter activeFilter={activeFilter} counts={counts} />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full border-border/70 bg-card transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{task.team}</p>
                      <h3 className="mt-2 text-base font-semibold tracking-tight transition-colors group-hover/card:text-primary">
                        {task.title}
                      </h3>
                    </div>
                    <Badge variant="outline" className={`shrink-0 rounded-full ${statusClasses[task.status]}`}>
                      {task.status === "completed" ? <Check className="mr-1 size-3" /> : <Clock3 className="mr-1 size-3" />}
                      {statusLabels[task.status]}
                    </Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {task.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-amber-500" />
                      Reward <span className="font-semibold text-foreground">+{task.rewardXp} XP</span>
                    </span>
                    <span>{task.updated}</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${
                        task.status === "completed"
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-primary to-indigo-400"
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>{task.status === "completed" ? "Selesai" : "Progres"}</span>
                    <span>{task.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border bg-card/50">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CircleDashed className="size-8 text-muted-foreground" />
            <p className="mt-3 font-medium">Belum ada tugas pada status ini</p>
            <p className="mt-1 text-sm text-muted-foreground">Pilih filter lain untuk melihat daftar tugas.</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function TaskListFallback() {
  return (
    <section aria-label="Daftar tugas" className="space-y-5">
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted sm:w-72" />
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-52 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
    </section>
  );
}

export default function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <div className="space-y-9">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Badge variant="secondary" className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="mr-1.5 size-3.5 text-primary" />
              Team workspace
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Ruang tugas</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Pantau momentum tim dan fokuskan energi pada pekerjaan yang paling berarti.
            </p>
          </div>
          <Link
            href="#create-task"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="mr-2 size-4" />
            Tambah Tugas
          </Link>
        </div>
      </section>

      <section aria-label="Ringkasan tugas" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const tone = metricToneClasses[metric.tone];
          const ChangeIcon = metric.change === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <Card
              key={metric.label}
              className={`relative overflow-hidden border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md`}
            >
              <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.glow} via-transparent to-transparent`} />
              <CardContent className="relative flex items-start justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">{metric.value}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <ChangeIcon className="size-3.5 text-primary" />
                    <span className="font-medium text-foreground">{metric.percentage}</span>
                    <span>{metric.note}</span>
                  </p>
                </div>
                <span className={`flex size-11 items-center justify-center rounded-2xl ${tone.icon}`}>
                  <Icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Suspense fallback={<TaskListFallback />}>
        <TaskListSection searchParams={searchParams} />
      </Suspense>

      <section id="create-task" className="scroll-mt-24">
        <CreateTaskForm />
      </section>
    </div>
  );
}
