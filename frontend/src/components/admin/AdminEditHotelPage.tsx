import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { AdminHotelForm } from "@/src/components/admin/AdminHotelForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { valuesFromHotelDetail } from "@/src/components/admin/adminHotelFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ApiError } from "@/src/lib/api/client";
import { getHotel } from "@/src/lib/api/hotels";

interface AdminEditHotelPageProps {
  readonly slug: string;
}

export default async function AdminEditHotelPage({ slug }: AdminEditHotelPageProps) {
  const hotel = await getHotel(slug)
    .then(valuesFromHotelDetail)
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    });

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
      pageTitle={hotel ? `Edit ${hotel.hotelName}` : "Hotel not found"}
      searchPlaceholder="Search hotel content..."
      sectionLabel="Update hotel listing content before review."
      teamValue="sales"
    >
      {hotel ? (
        <AdminHotelForm
          copy={{
            readinessEyebrow: "Update readiness",
            submitLabel: "Save hotel changes",
            savedSubmitLabel: "Saved changes",
            successTitle: "Hotel changes ready for review",
            successDescription: "The hotel changes have been saved to the backend catalog.",
          }}
          initialValues={hotel.initialValues}
          mode="update"
          originalSlug={slug}
        />
      ) : (
        <Card>
          <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-stone-100 text-stone-500">
              <SearchX className="size-7" />
            </span>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Hotel not found
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
              No backend hotel matches this slug
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
              Return to the hotel listing and choose an existing property.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin/hotels">Back to hotels</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
