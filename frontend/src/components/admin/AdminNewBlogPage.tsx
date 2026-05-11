import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminBlogForm } from "@/src/components/admin/AdminBlogForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { createBlogInitialValues } from "@/src/components/admin/adminBlogFormData";
import { Button } from "@/src/components/ui/button";

export default function AdminNewBlogPage() {
  return (
    <AdminShell
      activePath="/admin/blogs"
      action={
        <Button asChild className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
          <Link href="/admin/blogs">
            <ArrowLeft className="size-4" />
            Back to blogs
          </Link>
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Add article"
      searchPlaceholder="Search article content..."
      sectionLabel="Create an editorial draft with story, imagery, related posts, and SEO details."
      teamValue="sales"
    >
      <AdminBlogForm
        copy={{
          readinessEyebrow: "Editorial readiness",
          submitLabel: "Save article draft",
          savedSubmitLabel: "Saved draft",
          successTitle: "Article draft ready for review",
          successDescription: "The article has been saved to the backend journal.",
        }}
        initialValues={createBlogInitialValues}
        mode="create"
      />
    </AdminShell>
  );
}
