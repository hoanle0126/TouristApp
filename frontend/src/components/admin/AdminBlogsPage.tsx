import Link from "next/link";
import { ArrowRight, BookOpenText, Eye, Plus, SquarePen, TrendingUp } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getAdminBlogPosts } from "@/src/lib/api/blogs";
import type { ApiBlogCard, ApiBlogStatus } from "@/src/lib/api/types";

function getBlogStats(posts: readonly ApiBlogCard[]) {
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const topCategory = posts[0]?.category ?? "—";

  return [
    { label: "Published stories", value: `${publishedCount}`, note: "Active on journal" },
    { label: "Draft concepts", value: `${draftCount}`, note: "Awaiting editorial review" },
    { label: "Total articles", value: `${posts.length}`, note: "Across all statuses" },
    { label: "Top category", value: topCategory, note: "Most recent category" },
  ] as const;
}

function formatBlogStatus(status: ApiBlogStatus | undefined) {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Published";
}

export default async function AdminBlogsPage() {
  const blogPosts = await getAdminBlogPosts();
  const blogStats = getBlogStats(blogPosts);
  return (
    <AdminShell
      activePath="/admin/blogs"
      action={
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="size-4" />
            New article
          </Link>
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Blog management"
      searchPlaceholder="Search article, topic, editor..."
      sectionLabel="Editorial pipeline, published stories, and content performance across the journal."
      teamValue="sales"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {blogStats.map((item) => (
          <Card className="border-none bg-white" key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-stone-500">{item.label}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight text-stone-950">{item.value}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-800">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <Card>
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">Editorial pipeline</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">Published stories and next briefs</h3>
              </div>
              <Button size="sm" variant="ghost">
                Open calendar
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {blogPosts.map((post) => (
                <div className="rounded-2xl bg-stone-50 p-4" key={post.slug}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-800">{post.category}</p>
                      <p className="mt-2 text-lg font-bold tracking-tight text-stone-950">{post.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">{post.excerpt}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {formatBlogStatus(post.status)}
                      </span>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/blogs/${post.slug}/edit`}>
                          Edit
                          <SquarePen className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-stone-950 text-white">
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-200">Content watchlist</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">Editorial actions</h3>
              </div>
              <BookOpenText className="size-5 text-red-200" />
            </div>
            <div className="mt-6 space-y-3">
              {[
                { icon: TrendingUp, title: "Destination stories are outperforming", detail: "Double down on region-led stories tied to bookable itineraries." },
                { icon: Eye, title: "Refresh older features", detail: "Top evergreen entries need updated imagery and internal links to tours and stays." },
                { icon: SquarePen, title: "Queue new longform", detail: "Two draft briefs are ready for expansion into flagship editorial pieces." },
              ].map((item) => (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={item.title}>
                  <div className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <item.icon className="size-4 text-red-200" />
                    </span>
                    <div>
                      <p className="font-semibold tracking-tight">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/65">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AdminShell>
  );
}
