import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminDestinationForm } from "@/src/components/admin/AdminDestinationForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { createDestinationInitialValues } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";

export default function AdminNewDestinationPage() {
  return (
    <AdminShell
      activePath="/admin/destinations"
      action={
        <Button asChild className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
          <Link href="/admin/destinations">
            <ArrowLeft className="size-4" />
            Back to destinations
          </Link>
        </Button>
      }
      dateLabel="Thursday, April 30, 2026"
      pageTitle="Add destination"
      searchPlaceholder="Search destination content..."
      sectionLabel="Create a destination category for merchandising tours and hotels."
      teamValue="content"
    >
      <AdminDestinationForm
        copy={{
          readinessEyebrow: "Review readiness",
          submitLabel: "Save destination draft",
          savedSubmitLabel: "Saved draft",
          successTitle: "Destination draft ready for review",
          successDescription: "The destination has been saved to the backend catalog.",
        }}
        initialValues={createDestinationInitialValues}
        mode="create"
      />
    </AdminShell>
  );
}
