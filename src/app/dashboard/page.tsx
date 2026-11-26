import { requireUser } from "@/lib/auth";
import { getLeadStats, listLeads } from "@/lib/leads";
import { TopBar } from "@/components/TopBar";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const [leads, stats] = await Promise.all([listLeads({}), getLeadStats()]);

  return (
    <>
      <TopBar user={user} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <DashboardClient initialLeads={leads} initialStats={stats} />
      </main>
    </>
  );
}
