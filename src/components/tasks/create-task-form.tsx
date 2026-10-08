"use client";

import { useActionState } from "react";

import { createTaskAction } from "@/actions/tasks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState, TaskInput } from "@/lib/schemas";

const fieldClassName = (hasError: boolean) =>
  [
    "mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
    hasError ? "border-destructive focus-visible:ring-destructive/30" : "border-border focus-visible:ring-primary/30",
  ].join(" ");

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState<ActionState<TaskInput>, FormData>(
    createTaskAction,
    null,
  );

  const getFieldError = (field: keyof TaskInput) => state?.fieldErrors?.[field]?.[0];

  return (
    <Card className="border-border/80 bg-card/80 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em]">
            Task Mutation
          </Badge>
          <span className="text-xs text-muted-foreground">Server Action • React 19</span>
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Buat tugas baru</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            Mulai workflow tugas Anda dengan validasi server-side yang aman dan responsif.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.status === "error" && state.message ? (
            <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
              <AlertTitle>Validasi gagal</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          {state?.status === "success" && state.message ? (
            <Alert className="border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300">
              <AlertTitle className="text-emerald-700 dark:text-emerald-300">Berhasil disimpan</AlertTitle>
              <AlertDescription className="text-emerald-700/90 dark:text-emerald-300/90">{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="title">Judul tugas</Label>
            <Input
              id="title"
              name="title"
              autoComplete="off"
              placeholder="Misalnya: Review modul onboarding"
              aria-invalid={Boolean(getFieldError("title"))}
              className={fieldClassName(Boolean(getFieldError("title")))}
            />
            {getFieldError("title") ? (
              <p className="text-sm text-destructive">{getFieldError("title")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Judul tugas wajib diisi dan terdiri dari 3–100 karakter.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Jelaskan konteks, target, dan informasi penting untuk tugas ini..."
              aria-invalid={Boolean(getFieldError("description"))}
              className={fieldClassName(Boolean(getFieldError("description")))}
            />
            {getFieldError("description") ? (
              <p className="text-sm text-destructive">{getFieldError("description")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Opsional, maksimal 500 karakter.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritas</Label>
            <select
              id="priority"
              name="priority"
              defaultValue="medium"
              aria-invalid={Boolean(getFieldError("priority"))}
              className={fieldClassName(Boolean(getFieldError("priority")))}
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
            {getFieldError("priority") ? (
              <p className="text-sm text-destructive">{getFieldError("priority")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Prioritas memengaruhi urgensi tugas di timeline tim.</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div className="text-xs text-muted-foreground">
              {isPending ? "Menyimpan data..." : "Siap untuk diproses"}
            </div>
            <Button type="submit" disabled={isPending} className="min-w-[180px]">
              {isPending ? "Menyimpan..." : "Simpan Tugas"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
