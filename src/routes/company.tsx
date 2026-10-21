import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

const PAGE_LABELS: Record<string, string> = {
  "/company/intelligence": "Company Intelligence",
  "/company/skills": "Skill Intelligence",
};

function AppLayout() {
  const { selected } = useCompany();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const pageLabel = PAGE_LABELS[pathname];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-background">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-3 sm:px-5">
            <SidebarTrigger className="-ml-1" />
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
              <Link to="/" className="shrink-0 text-muted-foreground hover:text-foreground">
                Companies
              </Link>
              {selected && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="truncate font-medium text-foreground">{selected.companyName}</span>
                </>
              )}
              {pageLabel && (
                <>
                  <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground sm:block" aria-hidden />
                  <span className="hidden truncate text-muted-foreground sm:block">{pageLabel}</span>
                </>
              )}
            </nav>
          </header>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
