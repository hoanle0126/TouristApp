import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { AdminDestinationForm } from "@/src/components/admin/AdminDestinationForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { resolveAdminDestinationEditData } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

interface AdminEditDestinationPageProps {
  readonly slug: string;
}

export default function AdminEditDestinationPage({ slug }: AdminEditDestinationPageProps) {
  const destination = resolveAdminDestinationEditData(slug);

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
      pageTitle={destination ? `Edit ${destination.destinationTitle}` : "Destination not found"}
      searchPlaceholder="Search destination content..."
      sectionLabel="Update mock destination category content before review."
      teamValue="content"
    >
      {destination ? (
        <AdminDestinationForm
          copy={{
            readinessEyebrow: "Update readiness",
            submitLabel: "Save destination changes",
            savedSubmitLabel: "Saved changes",
            successTitle: "Destination changes ready for review",
            successDescription: "This mock submit keeps the edited data on this page and does not publish it.",
          }}
          initialValues={destination.initialValues}
        />
      ) : (
        <Card>
          <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-stone-100 text-stone-500">
              <SearchX className="size-7" />
            </span>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Destination not found
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
              No mock destination matches this slug
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
              Return to the destination listing and choose an existing destination card.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin/destinations">Back to destinations</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
