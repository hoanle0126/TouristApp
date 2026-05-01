import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminHotelForm } from "@/src/components/admin/AdminHotelForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { createHotelInitialValues } from "@/src/components/admin/adminHotelFormData";
import { Button } from "@/src/components/ui/button";

export default function AdminNewHotelPage() {
  return (
    <AdminShell
      activePath="/admin/hotels"
      action={
        <Button asChild className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
          <Link href="/admin/hotels">
            <ArrowLeft className="size-4" />
            Back to hotels
          </Link>
        </Button>
      }
      dateLabel="Thursday, April 30, 2026"
      pageTitle="Add hotel"
      searchPlaceholder="Search hotel content..."
      sectionLabel="Create a hotel draft with listing, story, and stay inventory details."
      teamValue="sales"
    >
      <AdminHotelForm
        copy={{
          readinessEyebrow: "Review readiness",
          submitLabel: "Save hotel draft",
          savedSubmitLabel: "Saved draft",
          successTitle: "Hotel draft ready for review",
          successDescription: "The hotel has been saved to the backend catalog.",
        }}
        initialValues={createHotelInitialValues}
        mode="create"
      />
    </AdminShell>
  );
}
