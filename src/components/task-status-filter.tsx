"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export type TaskStatusFilterValue = "all" | "running" | "completed";

type TaskStatusFilterProps = {
  activeFilter: TaskStatusFilterValue;
  counts: Record<TaskStatusFilterValue, number>;
};

const filters: Array<{ id: TaskStatusFilterValue; label: string; href: string }> = [
  { id: "all", label: "Semua", href: "/tasks" },
  { id: "running", label: "Berjalan", href: "/tasks?status=running" },
  { id: "completed", label: "Selesai", href: "/tasks?status=completed" },
];

export function TaskStatusFilter({ activeFilter, counts }: TaskStatusFilterProps) {
  return (
    <nav
      aria-label="Filter status tugas"
      className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border/70 bg-muted/50 p-1"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <Link
            key={filter.id}
            href={filter.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
            }`}
          >
            {filter.label}
            <Badge
              variant="secondary"
              className={`h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px] tabular-nums ${
                isActive ? "bg-primary/10 text-primary" : "bg-background/80 text-muted-foreground"
              }`}
            >
              {counts[filter.id]}
            </Badge>
          </Link>
        );
      })}
    </nav>
  );
}
