import { Bell, KeyRound, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Card, CardContent } from "@/src/components/ui/card";

const settingSections = [
  {
    description: "Control review gates for catalog changes before they appear in production booking flows.",
    icon: ShieldCheck,
    title: "Publishing controls",
    value: "Review required",
  },
  {
    description: "Route booking updates, payment exceptions, and supplier reminders to the operations queue.",
    icon: Bell,
    title: "Notifications",
    value: "Operations",
  },
  {
    description: "Keep team-level access grouped by sales, content, concierge, and operations workflows.",
    icon: KeyRound,
    title: "Access model",
    value: "Role based",
  },
  {
    description: "Tune default dashboard ranges, merchandising priorities, and admin table density.",
    icon: SlidersHorizontal,
    title: "Workspace defaults",
    value: "7-day view",
  },
] as const;

export default function AdminSettingsPage() {
  return (
    <AdminShell
      activePath="/admin/settings"
      dateLabel="Friday, May 01, 2026"
      pageTitle="Admin settings"
      searchPlaceholder="Search settings, roles, notification rules..."
      sectionLabel="Operational preferences for admin workflows, publishing, and team access."
      teamValue="operations"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {settingSections.map(({ description, icon: Icon, title, value }) => (
          <Card className="border-none bg-white" key={title}>
            <CardContent className="p-6">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-sm font-medium text-stone-500">{title}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-stone-950">{value}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
            Configuration status
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
            Settings route is ready for future controls
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-500">
            This page keeps the admin navigation complete while catalog, booking, and editorial settings are expanded into editable controls.
          </p>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
