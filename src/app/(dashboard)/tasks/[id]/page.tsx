import { ArrowLeft, Check, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type TaskDetail = {
  title: string;
  team: string;
  status: "in-progress" | "completed";
  description: string;
  rewardXp: number;
  progress: number;
  updated: string;
  nextStep: string;
};

const taskDetails: Record<string, TaskDetail> = {
  "1": {
    title: "Launch readiness review",
    team: "Platform team",
    status: "in-progress",
    description:
      "Review the release checklist, ownership, and final platform readiness before launch. Coordinate final sign-off across engineering, product, and operations.",
    rewardXp: 240,
    progress: 72,
    updated: "12 menit lalu",
    nextStep: "Konfirmasi observability checklist dan jadwalkan final sign-off.",
  },
  "2": {
    title: "Refactor API gateway",
    team: "Infrastructure",
    status: "completed",
    description:
      "Simplify request routing and improve observability across serverless endpoints. The gateway now has clearer ownership and consistent request tracing.",
    rewardXp: 320,
    progress: 100,
    updated: "Hari ini",
    nextStep: "Pekerjaan selesai dan siap untuk direview.",
  },
  "3": {
    title: "Onboarding experience audit",
    team: "Product design",
    status: "in-progress",
    description:
      "Map the first-session journey and identify friction points in team onboarding. Capture actionable recommendations for product and engineering.",
    rewardXp: 180,
    progress: 48,
    updated: "1 jam lalu",
    nextStep: "Validasi temuan usability bersama tim product.",
  },
  "4": {
    title: "Design system foundations",
    team: "Experience",
    status: "completed",
    description:
      "Document semantic color tokens, component patterns, and accessibility guidance for the shared design system.",
    rewardXp: 280,
    progress: 100,
    updated: "Kemarin",
    nextStep: "Pekerjaan selesai dan dokumentasi sudah tersedia.",
  },
  "5": {
    title: "Usage analytics pipeline",
    team: "Data platform",
    status: "in-progress",
    description:
      "Prepare a resilient event pipeline for workspace activity and usage reporting with reliable ingestion and clear data ownership.",
    rewardXp: 360,
    progress: 64,
    updated: "3 jam lalu",
    nextStep: "Uji retry behavior pada event ingestion dan pantau error rate.",
  },
  "6": {
    title: "Workspace access controls",
    team: "Security",
    status: "completed",
    description:
      "Align role-based permissions with the needs of distributed project teams and document the resulting access model.",
    rewardXp: 300,
    progress: 100,
    updated: "2 hari lalu",
    nextStep: "Pekerjaan selesai dan konfigurasi telah diverifikasi.",
  },
};

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = taskDetails[id];

  if (!task) {
    notFound();
  }

  const isCompleted = task.status === "completed";

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/tasks" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
              <ArrowLeft className="size-4" />
              Ruang tugas
            </Link>
          </li>
          <li aria-hidden="true" className="text-border">/</li>
          <li aria-current="page" className="font-medium text-foreground">Detail tugas</li>
        </ol>
      </nav>

      <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-primary via-violet-400 to-indigo-300" />
        <CardHeader className="space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-muted-foreground">
              TASK-{id.padStart(3, "0")}
            </Badge>
            <Badge
              variant="outline"
              className={`rounded-full ${
                isCompleted
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
              }`}
            >
              {isCompleted ? <Check className="mr-1 size-3" /> : <Clock3 className="mr-1 size-3" />}
              {isCompleted ? "Selesai" : "Sedang berjalan"}
            </Badge>
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">{task.title}</CardTitle>
            <CardDescription className="mt-3 text-sm text-muted-foreground">
              Dikelola oleh <span className="font-medium text-foreground">{task.team}</span>
              <span className="mx-2 text-border">•</span>
              Diperbarui {task.updated}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-6 pb-7 sm:px-8 sm:pb-9">
          <Separator />
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-sm font-semibold">Deskripsi tugas</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{task.description}</p>
          </section>

          <section aria-labelledby="progress-heading" className="rounded-2xl border border-border/70 bg-muted/30 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="progress-heading" className="text-sm font-semibold">Progres penyelesaian</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isCompleted ? "Semua milestone telah diselesaikan." : "Pekerjaan sedang bergerak sesuai rencana."}
                </p>
              </div>
              <span className="text-2xl font-semibold tracking-tight">{task.progress}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Progres penyelesaian tugas"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={task.progress}
              className="mt-4 h-2 overflow-hidden rounded-full bg-background"
            >
              <div
                className={`h-full rounded-full ${
                  isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-primary to-indigo-400"
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Reward</p>
              <p className="mt-3 flex items-center gap-2 text-xl font-semibold">
                <Sparkles className="size-5 text-amber-500" /> +{task.rewardXp} XP
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Langkah berikutnya</p>
              <p className="mt-3 text-sm leading-6 text-foreground">{task.nextStep}</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
