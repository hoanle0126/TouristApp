"use client";

import Image from "next/image";
import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, CircleAlert, FileText, ListChecks, Plus, Save, Trash2 } from "lucide-react";

import {
  blogStatusOptions,
  type BlogFormInitialValues,
  type BlogFormState,
  type BlogRelatedPostRow,
  type BlogSectionRow,
  type BlogTextRow,
  createEmptyRelatedPost,
  createEmptySection,
  slugifyBlogTitle,
} from "@/src/components/admin/adminBlogFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { createBlog, updateBlog, type SaveBlogInput } from "@/src/lib/api/blogs";

interface AdminBlogFormCopy {
  readonly readinessEyebrow: string;
  readonly submitLabel: string;
  readonly savedSubmitLabel: string;
  readonly successTitle: string;
  readonly successDescription: string;
}

interface AdminBlogFormProps {
  readonly copy: AdminBlogFormCopy;
  readonly initialValues: BlogFormInitialValues;
  readonly mode?: "create" | "update";
  readonly originalSlug?: string;
}

interface FormErrors {
  title?: string;
  excerpt?: string;
  image?: string;
  heroImage?: string;
  intro?: string;
}

function hasValue(value: string | undefined) {
  return (value ?? "").trim().length > 0;
}

function createTextRow(prefix: string): BlogTextRow {
  return { id: `${prefix}-${crypto.randomUUID()}`, value: "" };
}

function removeRow<T extends { readonly id: string }>(items: readonly T[], id: string) {
  return items.length > 1 ? items.filter((item) => item.id !== id) : items;
}

function updateSectionRow<K extends keyof BlogSectionRow>(items: readonly BlogSectionRow[], id: string, field: K, value: BlogSectionRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function updateRelatedPostRow<K extends keyof BlogRelatedPostRow>(items: readonly BlogRelatedPostRow[], id: string, field: K, value: BlogRelatedPostRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    body: formData,
    method: "POST",
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Unable to upload image.");
  }

  return String(payload.url);
}

function toPublishedAt(value: string) {
  return value ? new Date(`${value}T09:00:00.000Z`).toISOString() : new Date().toISOString();
}

function toBlogPayload(form: BlogFormState, sections: readonly BlogSectionRow[], relatedPosts: readonly BlogRelatedPostRow[]): SaveBlogInput {
  return {
    slug: slugifyBlogTitle(form.title),
    title: form.title,
    excerpt: form.excerpt,
    category: form.category,
    author: form.author,
    status: form.status,
    publishedAt: toPublishedAt(form.publishedAt),
    readingTime: form.readingTime,
    image: form.image,
    heroImage: form.heroImage,
    intro: form.intro,
    meta: form.meta,
    quote: form.quote,
    sections: sections
      .map((section) => ({
        ...(section.heading.trim() ? { heading: section.heading.trim() } : {}),
        body: section.body.map((row) => row.value.trim()).filter(Boolean),
      }))
      .filter((section) => section.heading || section.body.length > 0),
    inlineImage: { image: form.inlineImage || form.image },
    secondaryFeature: {
      title: form.secondaryFeatureTitle || form.title,
      body: form.secondaryFeatureBody || form.excerpt,
      image: { image: form.secondaryFeatureImage || form.heroImage || form.image },
    },
    relatedPosts: relatedPosts
      .filter((post) => [post.href, post.title, post.excerpt, post.category, post.image].every(hasValue))
      .map(({ category, excerpt, href, image, title }) => ({ category, excerpt, href, image, title })),
    seo: {
      ...(form.seoTitle ? { title: form.seoTitle } : {}),
      ...(form.seoDescription ? { description: form.seoDescription } : {}),
      ...(form.seoOgImage ? { ogImage: form.seoOgImage } : {}),
    },
  };
}

export function AdminBlogForm({ copy, initialValues, mode = "create", originalSlug }: AdminBlogFormProps) {
  const [form, setForm] = useState<BlogFormState>(initialValues.form);
  const [sections, setSections] = useState<readonly BlogSectionRow[]>(initialValues.sections);
  const [relatedPosts, setRelatedPosts] = useState<readonly BlogRelatedPostRow[]>(initialValues.relatedPosts);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readiness = useMemo(
    () => [
      { label: "Essentials", ready: [form.title, form.slug, form.excerpt, form.category, form.author].every(hasValue) },
      { label: "Media", ready: [form.image, form.heroImage].every(hasValue) },
      { label: "Story", ready: hasValue(form.intro) && sections.some((section) => section.body.some((row) => hasValue(row.value))) },
      { label: "SEO", ready: [form.seoTitle, form.seoDescription].some(hasValue) },
    ],
    [form, sections],
  );

  function updateField<K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) {
    setForm((current) => {
      if (field === "title") {
        return { ...current, title: value, slug: slugifyBlogTitle(String(value)) };
      }

      return { ...current, [field]: value };
    });
    setSaved(false);
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) nextErrors.title = "Blog title is required.";
    if (!form.excerpt.trim()) nextErrors.excerpt = "Excerpt is required.";
    if (!form.image.trim()) nextErrors.image = "Listing image URL is required.";
    if (!form.heroImage.trim()) nextErrors.heroImage = "Hero image URL is required.";
    if (!form.intro.trim()) nextErrors.intro = "Intro is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = toBlogPayload(form, sections, relatedPosts);
      const savedBlog = mode === "update"
        ? await updateBlog(originalSlug ?? form.slug, payload)
        : await createBlog(payload);
      setForm((current) => ({ ...current, slug: savedBlog.slug }));
      setSaved(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save blog.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_420px]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <BlogEssentialsSection errors={errors} form={form} updateField={updateField} />
        <BlogMediaSection errors={errors} form={form} updateField={updateField} />
        <BlogStorySection errors={errors} sections={sections} setSections={setSections} form={form} updateField={updateField} />
        <RelatedPostsSection relatedPosts={relatedPosts} setRelatedPosts={setRelatedPosts} />
        <SeoSection form={form} updateField={updateField} />
      </div>
      <BlogDraftSidebar copy={copy} form={form} isSubmitting={isSubmitting} readiness={readiness} saved={saved} submitError={submitError} />
    </form>
  );
}

function BlogDraftSidebar({ copy, form, isSubmitting, readiness, saved, submitError }: Readonly<{
  copy: AdminBlogFormCopy;
  form: BlogFormState;
  isSubmitting: boolean;
  readiness: readonly { readonly label: string; readonly ready: boolean }[];
  saved: boolean;
  submitError: string | null;
}>) {
  const completed = readiness.filter((item) => item.ready).length;

  return (
    <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <Card className="border-none bg-stone-950 text-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.85)]">
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-200">{copy.readinessEyebrow}</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">{completed} of {readiness.length} sections ready</h3>
            </div>
            <BadgeCheck className="size-6 text-red-200" />
          </div>
          <div className="mt-6 space-y-3">
            {readiness.map((item) => (
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3" key={item.label}>
                <span className="text-sm font-semibold">{item.label}<span className="sr-only">: {item.ready ? "ready" : "incomplete"}</span></span>
                {item.ready ? <CheckCircle2 className="size-4 text-red-200" /> : <CircleAlert className="size-4 text-white/45" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">Live summary</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-950">{form.title || "Untitled blog"}</h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{form.excerpt || "Add an excerpt to preview blog listing copy."}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <SummaryPill label="Category" value={form.category || "Not set"} />
            <SummaryPill label="Status" value={form.status} />
            <SummaryPill label="Reading" value={form.readingTime || "Not set"} />
          </div>
        </CardContent>
      </Card>
      {saved ? <StatusCard title={copy.successTitle} description={copy.successDescription} /> : null}
      {submitError ? <Card aria-live="polite" className="border-none bg-rose-100 text-rose-950" role="alert"><CardContent className="p-5 text-sm font-semibold">{submitError}</CardContent></Card> : null}
      <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
        <Save className="size-4" />
        {isSubmitting ? "Saving..." : saved ? copy.savedSubmitLabel : copy.submitLabel}
      </Button>
    </aside>
  );
}

function StatusCard({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <Card aria-live="polite" className="border-none bg-red-100 text-red-950" role="status">
      <CardContent className="flex gap-3 p-5">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm text-red-900/75">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryPill({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-stone-950">{value}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: Readonly<{ eyebrow: string; title: string; description: string }>) {
  return (
    <div className="border-b border-stone-200 pb-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}

function FieldError({ id, message }: Readonly<{ id?: string; message?: string }>) {
  return message ? <p className="mt-2 text-xs font-semibold text-rose-700" id={id}>{message}</p> : null;
}

function TextField({ error, id, label, onChange, value, disabled, hint }: Readonly<{ error?: string; id: string; label: string; onChange: (value: string) => void; value: string; disabled?: boolean; hint?: string }>) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input aria-describedby={errorId} aria-invalid={Boolean(error)} disabled={disabled} id={id} onChange={(event) => onChange(event.target.value)} value={value} />
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function ImageUploadField({ error, id, label, onChange, previewLabel, value }: Readonly<{
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  previewLabel: string;
  value: string;
}>) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      onChange(await uploadAdminImage(file));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
        {value ? (
          <div className="relative aspect-[4/3]">
            <Image alt={`${previewLabel} preview`} className="object-cover" fill sizes="(min-width: 768px) 50vw, 100vw" src={value} />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-stone-100 text-sm font-semibold text-stone-400">No preview</div>
        )}
      </div>
      <div className="mt-4 space-y-4">
        <TextField error={error} id={id} label={label} onChange={onChange} value={value} />
        <div>
          <Label htmlFor={`${id}-upload`}>Upload image</Label>
          <Input accept="image/gif,image/jpeg,image/png,image/webp" disabled={isUploading} id={`${id}-upload`} onChange={(event) => void handleUpload(event.target.files?.[0])} type="file" />
          <p className="mt-2 text-xs font-medium text-stone-500">{isUploading ? "Uploading..." : "JPG, PNG, WebP, or GIF up to 5MB."}</p>
          {uploadError ? <p className="mt-2 text-xs font-semibold text-rose-700">{uploadError}</p> : null}
        </div>
      </div>
    </div>
  );
}

function BlogEssentialsSection({ errors, form, updateField }: Readonly<{ errors: FormErrors; form: BlogFormState; updateField: <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => void }>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader description="Core metadata that powers the blog listing and editorial workflow." eyebrow="Essentials" title="Blog information" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.title} id="blog-title" label="Title" onChange={(value) => updateField("title", value)} value={form.title} />
          <TextField id="blog-slug" label="Slug" disabled hint="Auto-generated from the title." onChange={() => undefined} value={slugifyBlogTitle(form.title)} />
          <TextField error={errors.excerpt} id="blog-excerpt" label="Excerpt" onChange={(value) => updateField("excerpt", value)} value={form.excerpt} />
          <TextField id="blog-category" label="Category" onChange={(value) => updateField("category", value)} value={form.category} />
          <TextField id="blog-author" label="Author" onChange={(value) => updateField("author", value)} value={form.author} />
          <div>
            <Label htmlFor="blog-status">Status</Label>
            <Select value={form.status} onValueChange={(value: BlogFormState["status"]) => updateField("status", value)}>
              <SelectTrigger id="blog-status"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>{blogStatusOptions.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <TextField id="blog-published-at" label="Published date" onChange={(value) => updateField("publishedAt", value)} value={form.publishedAt} />
          <TextField id="blog-reading-time" label="Reading time" onChange={(value) => updateField("readingTime", value)} value={form.readingTime} />
        </div>
      </CardContent>
    </Card>
  );
}

function BlogMediaSection({ errors, form, updateField }: Readonly<{ errors: FormErrors; form: BlogFormState; updateField: <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => void }>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader description="Images used by listing cards, article hero, inline editorial modules, and secondary feature blocks." eyebrow="Media" title="Blog imagery" />
        <div className="grid gap-4 md:grid-cols-2">
          <ImageUploadField error={errors.image} id="blog-image" label="Listing image URL" onChange={(value) => updateField("image", value)} previewLabel="Listing image" value={form.image} />
          <ImageUploadField error={errors.heroImage} id="blog-hero-image" label="Hero image URL" onChange={(value) => updateField("heroImage", value)} previewLabel="Hero image" value={form.heroImage} />
          <ImageUploadField id="blog-inline-image" label="Inline image URL" onChange={(value) => updateField("inlineImage", value)} previewLabel="Inline image" value={form.inlineImage} />
          <ImageUploadField id="blog-secondary-image" label="Secondary feature image URL" onChange={(value) => updateField("secondaryFeatureImage", value)} previewLabel="Secondary feature image" value={form.secondaryFeatureImage} />
        </div>
      </CardContent>
    </Card>
  );
}

function BlogStorySection({ errors, form, sections, setSections, updateField }: Readonly<{
  errors: FormErrors;
  form: BlogFormState;
  sections: readonly BlogSectionRow[];
  setSections: (sections: readonly BlogSectionRow[]) => void;
  updateField: <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader description="Long-form article content shown on the public blog detail page." eyebrow="Story" title="Article content" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField error={errors.intro} id="blog-intro" label="Intro" onChange={(value) => updateField("intro", value)} value={form.intro} />
          <TextAreaField id="blog-meta" label="Meta" onChange={(value) => updateField("meta", value)} value={form.meta} />
          <TextAreaField id="blog-quote" label="Quote" onChange={(value) => updateField("quote", value)} value={form.quote} />
          <TextAreaField id="blog-secondary-body" label="Secondary feature body" onChange={(value) => updateField("secondaryFeatureBody", value)} value={form.secondaryFeatureBody} />
          <TextField id="blog-secondary-title" label="Secondary feature title" onChange={(value) => updateField("secondaryFeatureTitle", value)} value={form.secondaryFeatureTitle} />
        </div>
        <SectionsEditor sections={sections} setSections={setSections} />
      </CardContent>
    </Card>
  );
}

function TextAreaField({ error, id, label, onChange, value }: Readonly<{ error?: string; id: string; label: string; onChange: (value: string) => void; value: string }>) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea aria-describedby={errorId} aria-invalid={Boolean(error)} id={id} onChange={(event) => onChange(event.target.value)} value={value} />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function CollectionHeader({ addLabel, icon, label, onAdd }: Readonly<{ addLabel: string; icon: ReactNode; label: string; onAdd: () => void }>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-bold text-stone-950"><span className="flex size-9 items-center justify-center rounded-2xl bg-red-100 text-red-900">{icon}</span>{label}</div>
      <Button aria-label={addLabel} onClick={onAdd} size="sm" type="button" variant="outline"><Plus className="size-4" />{addLabel}</Button>
    </div>
  );
}

function RowHeader({ disabled, label, onRemove, removeLabel }: Readonly<{ disabled: boolean; label: string; onRemove: () => void; removeLabel: string }>) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-bold text-stone-950">{label}</p>
      <Button aria-label={removeLabel} disabled={disabled} onClick={onRemove} size="icon" type="button" variant="ghost"><Trash2 className="size-4" /></Button>
    </div>
  );
}

function SectionsEditor({ sections, setSections }: Readonly<{ sections: readonly BlogSectionRow[]; setSections: (sections: readonly BlogSectionRow[]) => void }>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
      <CollectionHeader addLabel="Add section" icon={<FileText className="size-4" />} label="Sections" onAdd={() => setSections([...sections, createEmptySection(`section-${crypto.randomUUID()}`)])} />
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={section.id}>
            <RowHeader disabled={sections.length <= 1} label={`Section ${index + 1}`} onRemove={() => setSections(removeRow(sections, section.id))} removeLabel={`Remove section ${index + 1}`} />
            <TextField id={`${section.id}-heading`} label="Heading" onChange={(value) => setSections(updateSectionRow(sections, section.id, "heading", value))} value={section.heading} />
            <div className="mt-4 space-y-3">
              <CollectionHeader addLabel="Add paragraph" icon={<ListChecks className="size-4" />} label="Body paragraphs" onAdd={() => setSections(updateSectionRow(sections, section.id, "body", [...section.body, createTextRow(`${section.id}-body`)]))} />
              {section.body.map((row, rowIndex) => (
                <div key={row.id}>
                  <RowHeader disabled={section.body.length <= 1} label={`Paragraph ${rowIndex + 1}`} onRemove={() => setSections(updateSectionRow(sections, section.id, "body", removeRow(section.body, row.id)))} removeLabel={`Remove paragraph ${rowIndex + 1}`} />
                  <Textarea id={`${row.id}-value`} onChange={(event) => setSections(updateSectionRow(sections, section.id, "body", section.body.map((item) => item.id === row.id ? { ...item, value: event.target.value } : item)))} value={row.value} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedPostsSection({ relatedPosts, setRelatedPosts }: Readonly<{ relatedPosts: readonly BlogRelatedPostRow[]; setRelatedPosts: (posts: readonly BlogRelatedPostRow[]) => void }>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader description="Optional related story cards shown near the article footer." eyebrow="Related" title="Related posts" />
        <CollectionHeader addLabel="Add related post" icon={<ListChecks className="size-4" />} label="Related posts" onAdd={() => setRelatedPosts([...relatedPosts, createEmptyRelatedPost(`related-post-${crypto.randomUUID()}`)])} />
        <div className="space-y-4">
          {relatedPosts.map((post, index) => (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={post.id}>
              <RowHeader disabled={relatedPosts.length <= 1} label={`Related post ${index + 1}`} onRemove={() => setRelatedPosts(removeRow(relatedPosts, post.id))} removeLabel={`Remove related post ${index + 1}`} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField id={`${post.id}-href`} label="Href" onChange={(value) => setRelatedPosts(updateRelatedPostRow(relatedPosts, post.id, "href", value))} value={post.href} />
                <TextField id={`${post.id}-title`} label="Title" onChange={(value) => setRelatedPosts(updateRelatedPostRow(relatedPosts, post.id, "title", value))} value={post.title} />
                <TextField id={`${post.id}-category`} label="Category" onChange={(value) => setRelatedPosts(updateRelatedPostRow(relatedPosts, post.id, "category", value))} value={post.category} />
                <TextField id={`${post.id}-image`} label="Image URL" onChange={(value) => setRelatedPosts(updateRelatedPostRow(relatedPosts, post.id, "image", value))} value={post.image} />
              </div>
              <div className="mt-4"><TextAreaField id={`${post.id}-excerpt`} label="Excerpt" onChange={(value) => setRelatedPosts(updateRelatedPostRow(relatedPosts, post.id, "excerpt", value))} value={post.excerpt} /></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SeoSection({ form, updateField }: Readonly<{ form: BlogFormState; updateField: <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => void }>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader description="Optional SEO metadata saved with the blog post." eyebrow="SEO" title="Search metadata" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField id="blog-seo-title" label="SEO title" onChange={(value) => updateField("seoTitle", value)} value={form.seoTitle} />
          <TextField id="blog-seo-og-image" label="SEO image URL" onChange={(value) => updateField("seoOgImage", value)} value={form.seoOgImage} />
          <div className="md:col-span-2"><TextAreaField id="blog-seo-description" label="SEO description" onChange={(value) => updateField("seoDescription", value)} value={form.seoDescription} /></div>
        </div>
      </CardContent>
    </Card>
  );
}
