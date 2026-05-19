"use client";

import { FormEvent, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { ImageUploadInput } from "@/src/components/admin/ImageUploadInput";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  updateContactPage,
  type ContactPageContent,
} from "@/src/lib/api/contact-page";

type EditableContent = {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  offices: { name: string; address: string[] }[];
  departments: { name: string; email: string }[];
  mapImage: string;
  mapAlt: string;
  mapTitle: string;
  mapNote: string;
};

function toEditable(content: ContactPageContent): EditableContent {
  return {
    heroTitle: content.heroTitle,
    heroSubtitle: content.heroSubtitle,
    formTitle: content.formTitle,
    formSubtitle: content.formSubtitle,
    offices: content.offices.map((office) => ({
      name: office.name,
      address: [...office.address],
    })),
    departments: content.departments.map((department) => ({ ...department })),
    mapImage: content.mapImage,
    mapAlt: content.mapAlt,
    mapTitle: content.mapTitle,
    mapNote: content.mapNote,
  };
}

export default function AdminContactPage({
  initialContent,
}: Readonly<{ initialContent: ContactPageContent }>) {
  const [form, setForm] = useState<EditableContent>(toEditable(initialContent));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof EditableContent>(
    field: K,
    value: EditableContent[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function updateOffice(
    index: number,
    field: "name",
    value: string,
  ): void;
  function updateOffice(
    index: number,
    field: "address",
    value: string[],
  ): void;
  function updateOffice(
    index: number,
    field: "name" | "address",
    value: string | string[],
  ) {
    setForm((current) => {
      const next = [...current.offices];
      next[index] = { ...next[index], [field]: value };
      return { ...current, offices: next };
    });
    setSaved(false);
  }

  function addOffice() {
    setForm((current) => ({
      ...current,
      offices: [...current.offices, { name: "", address: [""] }],
    }));
  }

  function removeOffice(index: number) {
    setForm((current) => ({
      ...current,
      offices: current.offices.filter((_, currentIndex) => currentIndex !== index),
    }));
    setSaved(false);
  }

  function updateDepartment(
    index: number,
    field: keyof EditableContent["departments"][number],
    value: string,
  ) {
    setForm((current) => {
      const next = [...current.departments];
      next[index] = { ...next[index], [field]: value };
      return { ...current, departments: next };
    });
    setSaved(false);
  }

  function addDepartment() {
    setForm((current) => ({
      ...current,
      departments: [...current.departments, { name: "", email: "" }],
    }));
  }

  function removeDepartment(index: number) {
    setForm((current) => ({
      ...current,
      departments: current.departments.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSubmitting(true);

    try {
      const payload: ContactPageContent = {
        heroTitle: form.heroTitle.trim(),
        heroSubtitle: form.heroSubtitle.trim(),
        formTitle: form.formTitle.trim(),
        formSubtitle: form.formSubtitle.trim(),
        offices: form.offices.map((office) => ({
          name: office.name.trim(),
          address: office.address.map((line) => line.trim()).filter(Boolean),
        })),
        departments: form.departments.map((department) => ({
          name: department.name.trim(),
          email: department.email.trim(),
        })),
        mapImage: form.mapImage.trim(),
        mapAlt: form.mapAlt.trim(),
        mapTitle: form.mapTitle.trim(),
        mapNote: form.mapNote.trim(),
      };

      await updateContactPage(payload);
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save Contact page content.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell
      activePath="/admin/contact"
      dateLabel=""
      pageTitle="Contact page"
      searchPlaceholder="Search section..."
      sectionLabel="Edit every block on the public Contact page (hero, offices, departments, map)."
      teamValue="content"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                Hero
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Top heading
              </h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-hero-title">Hero title</Label>
              <Input
                id="contact-hero-title"
                onChange={(event) => update("heroTitle", event.target.value)}
                value={form.heroTitle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-hero-subtitle">Hero subtitle</Label>
              <Textarea
                id="contact-hero-subtitle"
                onChange={(event) =>
                  update("heroSubtitle", event.target.value)
                }
                rows={3}
                value={form.heroSubtitle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                Inquiry form
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Form copy
              </h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-form-title">Form title</Label>
              <Input
                id="contact-form-title"
                onChange={(event) => update("formTitle", event.target.value)}
                value={form.formTitle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-form-subtitle">Form subtitle</Label>
              <Textarea
                id="contact-form-subtitle"
                onChange={(event) =>
                  update("formSubtitle", event.target.value)
                }
                rows={2}
                value={form.formSubtitle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Offices
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Global locations
                </h3>
              </div>
              <Button
                onClick={addOffice}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add office
              </Button>
            </div>
            <div className="grid gap-5">
              {form.offices.map((office, index) => (
                <div
                  className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-5"
                  key={index}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-stone-950">
                      Office #{index + 1}
                    </p>
                    <Button
                      aria-label="Remove office"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => removeOffice(index)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-office-${index}-name`}>
                      Name
                    </Label>
                    <Input
                      id={`contact-office-${index}-name`}
                      onChange={(event) =>
                        updateOffice(index, "name", event.target.value)
                      }
                      value={office.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-office-${index}-address`}>
                      Address (one line per row)
                    </Label>
                    <Textarea
                      id={`contact-office-${index}-address`}
                      onChange={(event) =>
                        updateOffice(
                          index,
                          "address",
                          event.target.value.split("\n"),
                        )
                      }
                      rows={4}
                      value={office.address.join("\n")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Departments
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Direct emails
                </h3>
              </div>
              <Button
                onClick={addDepartment}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add department
              </Button>
            </div>
            <div className="grid gap-3">
              {form.departments.map((department, index) => (
                <div
                  className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:grid-cols-[1fr_1fr_auto]"
                  key={index}
                >
                  <div className="space-y-2">
                    <Label htmlFor={`contact-department-${index}-name`}>
                      Department name
                    </Label>
                    <Input
                      id={`contact-department-${index}-name`}
                      onChange={(event) =>
                        updateDepartment(index, "name", event.target.value)
                      }
                      value={department.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-department-${index}-email`}>
                      Email
                    </Label>
                    <Input
                      id={`contact-department-${index}-email`}
                      onChange={(event) =>
                        updateDepartment(index, "email", event.target.value)
                      }
                      type="email"
                      value={department.email}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      aria-label="Remove department"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => removeDepartment(index)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                Map
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Visual location
              </h3>
            </div>
            <ImageUploadInput
              id="contact-map-image"
              label="Map image"
              onChange={(value) => update("mapImage", value)}
              value={form.mapImage}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-map-alt">Map image alt text</Label>
                <Input
                  id="contact-map-alt"
                  onChange={(event) => update("mapAlt", event.target.value)}
                  value={form.mapAlt}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-map-title">Map card title</Label>
                <Input
                  id="contact-map-title"
                  onChange={(event) => update("mapTitle", event.target.value)}
                  value={form.mapTitle}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-map-note">Map card note</Label>
              <Textarea
                id="contact-map-note"
                onChange={(event) => update("mapNote", event.target.value)}
                rows={3}
                value={form.mapNote}
              />
            </div>
          </CardContent>
        </Card>

        {saved ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            Contact page saved. Refresh the public page to see the update.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
            {error}
          </p>
        ) : null}

        <div className="sticky bottom-4 flex justify-end">
          <Button
            className="shadow-lg"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            <Save className="size-4" />
            {isSubmitting ? "Saving..." : "Save Contact page"}
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
