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
  updateAboutPage,
  type AboutPageContent,
} from "@/src/lib/api/about-page";

type EditableContent = {
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  storyImage: string;
  storyAlt: string;
  storyHeading: string;
  storyBody: string[];
  storyCtaLabel: string;
  mission: string;
  vision: string;
  curators: {
    name: string;
    role: string;
    bio: string;
    image: string;
    alt: string;
  }[];
  philosophy: {
    title: string;
    description: string;
    icon: "nature" | "sparkle" | "leaf";
  }[];
  cta: string;
  ctaButtonLabel: string;
};

function toEditable(content: AboutPageContent): EditableContent {
  return {
    heroImage: content.heroImage,
    heroAlt: content.heroAlt,
    heroTitle: content.heroTitle,
    heroSubtitle: content.heroSubtitle,
    storyImage: content.storyImage,
    storyAlt: content.storyAlt,
    storyHeading: content.storyHeading,
    storyBody: [...content.storyBody],
    storyCtaLabel: content.storyCtaLabel,
    mission: content.mission,
    vision: content.vision,
    curators: content.curators.map((curator) => ({ ...curator })),
    philosophy: content.philosophy.map((pillar) => ({ ...pillar })),
    cta: content.cta,
    ctaButtonLabel: content.ctaButtonLabel,
  };
}

export default function AdminAboutPage({
  initialContent,
}: Readonly<{ initialContent: AboutPageContent }>) {
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

  function updateStoryBodyAt(index: number, value: string) {
    setForm((current) => {
      const next = [...current.storyBody];
      next[index] = value;
      return { ...current, storyBody: next };
    });
    setSaved(false);
  }

  function addStoryParagraph() {
    setForm((current) => ({
      ...current,
      storyBody: [...current.storyBody, ""],
    }));
  }

  function removeStoryParagraph(index: number) {
    setForm((current) => ({
      ...current,
      storyBody: current.storyBody.filter((_, currentIndex) => currentIndex !== index),
    }));
    setSaved(false);
  }

  function updateCurator(
    index: number,
    field: keyof EditableContent["curators"][number],
    value: string,
  ) {
    setForm((current) => {
      const next = [...current.curators];
      next[index] = { ...next[index], [field]: value };
      return { ...current, curators: next };
    });
    setSaved(false);
  }

  function addCurator() {
    setForm((current) => ({
      ...current,
      curators: [
        ...current.curators,
        { name: "", role: "", bio: "", image: "", alt: "" },
      ],
    }));
  }

  function removeCurator(index: number) {
    setForm((current) => ({
      ...current,
      curators: current.curators.filter((_, currentIndex) => currentIndex !== index),
    }));
    setSaved(false);
  }

  function updatePillar(
    index: number,
    field: keyof EditableContent["philosophy"][number],
    value: string,
  ) {
    setForm((current) => {
      const next = [...current.philosophy];
      next[index] = { ...next[index], [field]: value as never };
      return { ...current, philosophy: next };
    });
    setSaved(false);
  }

  function addPillar() {
    setForm((current) => ({
      ...current,
      philosophy: [
        ...current.philosophy,
        { title: "", description: "", icon: "nature" },
      ],
    }));
  }

  function removePillar(index: number) {
    setForm((current) => ({
      ...current,
      philosophy: current.philosophy.filter(
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
      await updateAboutPage(form);
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save About page content.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell
      activePath="/admin/about"
      dateLabel=""
      pageTitle="About page"
      searchPlaceholder="Search section..."
      sectionLabel="Edit every block on the public About page (hero, story, mission, curators, philosophy, CTA)."
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
                Top banner
              </h3>
            </div>
            <ImageUploadInput
              id="about-hero-image"
              label="Hero background image"
              onChange={(value) => update("heroImage", value)}
              value={form.heroImage}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="about-hero-alt">Hero image alt text</Label>
                <Input
                  id="about-hero-alt"
                  onChange={(event) => update("heroAlt", event.target.value)}
                  value={form.heroAlt}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-hero-title">Hero title</Label>
                <Input
                  id="about-hero-title"
                  onChange={(event) => update("heroTitle", event.target.value)}
                  value={form.heroTitle}
                />
                <p className="text-xs text-stone-500">Use \n to break a line.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-hero-subtitle">Hero subtitle</Label>
              <Textarea
                id="about-hero-subtitle"
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
                Story
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Our narrative
              </h3>
            </div>
            <ImageUploadInput
              id="about-story-image"
              label="Story image"
              onChange={(value) => update("storyImage", value)}
              value={form.storyImage}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="about-story-alt">Story image alt text</Label>
                <Input
                  id="about-story-alt"
                  onChange={(event) => update("storyAlt", event.target.value)}
                  value={form.storyAlt}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-story-cta">CTA label</Label>
                <Input
                  id="about-story-cta"
                  onChange={(event) =>
                    update("storyCtaLabel", event.target.value)
                  }
                  value={form.storyCtaLabel}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-story-heading">Story heading</Label>
              <Input
                id="about-story-heading"
                onChange={(event) =>
                  update("storyHeading", event.target.value)
                }
                value={form.storyHeading}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Story paragraphs</Label>
                <Button
                  onClick={addStoryParagraph}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Plus className="size-4" />
                  Add paragraph
                </Button>
              </div>
              {form.storyBody.map((paragraph, index) => (
                <div className="flex items-start gap-3" key={index}>
                  <Textarea
                    onChange={(event) =>
                      updateStoryBodyAt(index, event.target.value)
                    }
                    rows={3}
                    value={paragraph}
                  />
                  <Button
                    aria-label="Remove paragraph"
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    onClick={() => removeStoryParagraph(index)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                Mission &amp; Vision
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Curating with intent
              </h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-mission">Mission statement</Label>
              <Textarea
                id="about-mission"
                onChange={(event) => update("mission", event.target.value)}
                rows={4}
                value={form.mission}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-vision">Vision statement</Label>
              <Textarea
                id="about-vision"
                onChange={(event) => update("vision", event.target.value)}
                rows={4}
                value={form.vision}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Curators
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Meet the team
                </h3>
              </div>
              <Button
                onClick={addCurator}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add curator
              </Button>
            </div>
            <div className="grid gap-5">
              {form.curators.map((curator, index) => (
                <div
                  className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-5"
                  key={index}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-stone-950">
                      Curator #{index + 1}
                    </p>
                    <Button
                      aria-label="Remove curator"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => removeCurator(index)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                  <ImageUploadInput
                    id={`about-curator-${index}-image`}
                    label="Portrait"
                    onChange={(value) => updateCurator(index, "image", value)}
                    value={curator.image}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`about-curator-${index}-name`}>
                        Name
                      </Label>
                      <Input
                        id={`about-curator-${index}-name`}
                        onChange={(event) =>
                          updateCurator(index, "name", event.target.value)
                        }
                        value={curator.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`about-curator-${index}-role`}>
                        Role
                      </Label>
                      <Input
                        id={`about-curator-${index}-role`}
                        onChange={(event) =>
                          updateCurator(index, "role", event.target.value)
                        }
                        value={curator.role}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`about-curator-${index}-alt`}>
                      Image alt text
                    </Label>
                    <Input
                      id={`about-curator-${index}-alt`}
                      onChange={(event) =>
                        updateCurator(index, "alt", event.target.value)
                      }
                      value={curator.alt}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`about-curator-${index}-bio`}>Bio</Label>
                    <Textarea
                      id={`about-curator-${index}-bio`}
                      onChange={(event) =>
                        updateCurator(index, "bio", event.target.value)
                      }
                      rows={3}
                      value={curator.bio}
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
                  Philosophy
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Core pillars
                </h3>
              </div>
              <Button
                onClick={addPillar}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add pillar
              </Button>
            </div>
            <div className="grid gap-5">
              {form.philosophy.map((pillar, index) => (
                <div
                  className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-5"
                  key={index}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-stone-950">
                      Pillar #{index + 1}
                    </p>
                    <Button
                      aria-label="Remove pillar"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={() => removePillar(index)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                    <div className="space-y-2">
                      <Label htmlFor={`about-pillar-${index}-title`}>
                        Title
                      </Label>
                      <Input
                        id={`about-pillar-${index}-title`}
                        onChange={(event) =>
                          updatePillar(index, "title", event.target.value)
                        }
                        value={pillar.title}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`about-pillar-${index}-icon`}>Icon</Label>
                      <select
                        className="flex h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm"
                        id={`about-pillar-${index}-icon`}
                        onChange={(event) =>
                          updatePillar(index, "icon", event.target.value)
                        }
                        value={pillar.icon}
                      >
                        <option value="nature">Nature (sprout)</option>
                        <option value="sparkle">Sparkle</option>
                        <option value="leaf">Leaf</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`about-pillar-${index}-description`}>
                      Description
                    </Label>
                    <Textarea
                      id={`about-pillar-${index}-description`}
                      onChange={(event) =>
                        updatePillar(index, "description", event.target.value)
                      }
                      rows={3}
                      value={pillar.description}
                    />
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
                Closing CTA
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Bottom banner
              </h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-cta">Headline</Label>
              <Textarea
                id="about-cta"
                onChange={(event) => update("cta", event.target.value)}
                rows={3}
                value={form.cta}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-cta-button">Button label</Label>
              <Input
                id="about-cta-button"
                onChange={(event) =>
                  update("ctaButtonLabel", event.target.value)
                }
                value={form.ctaButtonLabel}
              />
            </div>
          </CardContent>
        </Card>

        {saved ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            About page saved. Refresh the public page to see the update.
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
            {isSubmitting ? "Saving..." : "Save About page"}
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
