import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminTourForm } from "@/src/components/admin/AdminTourForm";
import { createTourInitialValues } from "@/src/components/admin/adminTourFormData";
import { Button } from "@/src/components/ui/button";

export default function AdminNewTourPage() {
  return (
    <AdminShell
      activePath="/admin/tours"
      action={
        <Button asChild className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
          <Link href="/admin/tours">
            <ArrowLeft className="size-4" />
            Back to tours
          </Link>
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Add new tour"
      searchPlaceholder="Search route, guide, departure..."
      sectionLabel="Create a tour draft with client-facing content and operational details."
      teamValue="sales"
    >
      <AdminTourForm
        copy={{
          readinessEyebrow: "Publish readiness",
          submitLabel: "Save tour draft",
          savedSubmitLabel: "Saved draft",
          successTitle: "Tour draft ready for review",
          successDescription: "This mock submit keeps the data on this page and does not publish it.",
        }}
        initialValues={createTourInitialValues}
      />
    </AdminShell>
  );
}
