"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Mail, Search, Trash2 } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  deleteNewsletterSubscriber,
  type NewsletterSubscriber,
} from "@/src/lib/api/newsletter";

interface AdminNewsletterPageProps {
  readonly initialSubscribers: readonly NewsletterSubscriber[];
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminNewsletterPage({
  initialSubscribers,
}: AdminNewsletterPageProps) {
  const [subscribers, setSubscribers] = useState<readonly NewsletterSubscriber[]>(
    initialSubscribers,
  );
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return subscribers;
    }
    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(trimmed),
    );
  }, [query, subscribers]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  async function handleDelete(id: string, email: string) {
    if (!window.confirm(`Remove ${email} from the newsletter list?`)) {
      return;
    }

    setError(null);
    setPendingId(id);

    try {
      await deleteNewsletterSubscriber(id);
      setSubscribers((current) =>
        current.filter((subscriber) => subscriber.id !== id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete subscriber.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <AdminShell
      activePath="/admin/newsletter"
      dateLabel="Newsletter overview"
      pageTitle="Newsletter subscribers"
      searchPlaceholder="Search subscribers"
      sectionLabel="Marketing"
    >
      <div className="space-y-6">
        <Card className="border-stone-200 bg-white">
          <CardContent className="space-y-4 p-6">
            <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-stone-950">
                  <Mail className="size-5 text-red-800" />
                  Subscribers
                </h2>
                <p className="text-sm text-stone-500">
                  Emails captured via the public newsletter form in the website
                  footer.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                {subscribers.length} total
              </p>
            </header>

            <form className="flex gap-2" onSubmit={handleSearch}>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <Input
                  className="pl-10"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter by email"
                  type="search"
                  value={query}
                />
              </div>
            </form>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {filtered.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center text-sm text-stone-500">
                {subscribers.length === 0
                  ? "No subscribers yet. They will appear here once visitors sign up."
                  : "No subscribers match your search."}
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-xs font-bold uppercase tracking-widest text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Subscribed</th>
                      <th className="w-24 px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filtered.map((subscriber) => (
                      <tr className="hover:bg-stone-50" key={subscriber.id}>
                        <td className="px-4 py-3 font-medium text-stone-950">
                          {subscriber.email}
                        </td>
                        <td className="px-4 py-3 text-stone-500">
                          {formatDate(subscriber.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            aria-label={`Remove ${subscriber.email}`}
                            className="text-stone-500 hover:text-red-700"
                            disabled={pendingId === subscriber.id}
                            onClick={() =>
                              handleDelete(subscriber.id, subscriber.email)
                            }
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
