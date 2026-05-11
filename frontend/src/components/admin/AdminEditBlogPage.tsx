import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

import { AdminBlogForm } from "@/src/components/admin/AdminBlogForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { valuesFromBlogDetail } from "@/src/components/admin/adminBlogFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ApiError } from "@/src/lib/api/client";
import { getAdminBlog } from "@/src/lib/api/blogs";

interface AdminEditBlogPageProps {
  readonly slug: string;
}

export default async function AdminEditBlogPage({ slug }: AdminEditBlogPageProps) {
  const blog = await getAdminBlog(slug)
    .then(valuesFromBlogDetail)
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    });

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
      pageTitle={blog ? `Edit ${blog.blogTitle}` : "Article not found"}
      searchPlaceholder="Search article content..."
      sectionLabel="Update editorial content before review or publishing."
      teamValue="sales"
    >
      {blog ? (
        <AdminBlogForm
          copy={{
            readinessEyebrow: "Update readiness",
            submitLabel: "Save article changes",
            savedSubmitLabel: "Saved changes",
            successTitle: "Article changes ready for review",
            successDescription: "The article changes have been saved to the backend journal.",
          }}
          initialValues={blog.initialValues}
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
              Article not found
            </p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
              No backend article matches this slug
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
              Return to the blog listing and choose an existing article.
            </p>
            <Button asChild className="mt-6">
              <Link href="/admin/blogs">Back to blogs</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
