import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 sm:px-10">
          <div className="flex min-w-0 items-center gap-8">
            <Link href="/tasks" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                <span className="text-sm font-bold">C</span>
              </span>
              <span>CloudTask <span className="text-muted-foreground">Pro</span></span>
            </Link>
            <nav aria-label="Navigasi utama" className="hidden items-center gap-1 sm:flex">
              <Link href="/tasks" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Tugas
              </Link>
              <Link href="/analytics" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                Analitik
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span aria-hidden="true" className="hidden h-7 w-px bg-border sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-5">Alex Morgan</p>
                <p className="text-xs text-muted-foreground">Workspace admin</p>
              </div>
              <Avatar className="size-9 border border-border shadow-sm">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">AM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 sm:py-10">
        {children}
      </main>
    </div>
  );
}
