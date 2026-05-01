import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminTourForm } from "@/src/components/admin/AdminTourForm";
import { valuesFromTourDetail } from "@/src/components/admin/adminTourFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ApiError } from "@/src/lib/api/client";
import { getTour } from "@/src/lib/api/tours";

interface AdminEditTourPageProps {
  readonly slug: string;
}

export default async function AdminEditTourPage({ slug }: AdminEditTourPageProps) {
  const tour = await getTour(slug)
    .then(valuesFromTourDetail)
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    });

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
      pageTitle="Edit tour"
      searchPlaceholder="Search route, guide, departure..."
      sectionLabel={tour ? `Update client content and operations for ${tour.title}.` : "Choose an existing tour to edit."}
      teamValue="sales"
    >
      {tour ? (
        <AdminTourForm
          copy={{
            readinessEyebrow: "Edit readiness",
            modeBadge: "Editing existing tour",
            submitLabel: "Save changes",
            savedSubmitLabel: "Saved changes",
            successTitle: "Tour changes ready for review",
            successDescription: "The tour changes have been saved to the backend catalog.",
          }}
          initialValues={tour}
          mode="update"
          originalSlug={tour.slug}
        />
      ) : (
        <Card>
          <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-stone-100 text-stone-500">
              <SearchX className="size-7" />
            </span>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Tour not found
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
              No editable tour matches this slug
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
              Return to the tour listing and choose an existing backend tour.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin/tours">Back to tours</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
