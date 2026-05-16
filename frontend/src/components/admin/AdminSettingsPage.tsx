"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Globe2,
  KeyRound,
  Landmark,
  LoaderCircle,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ImageUploadInput } from "@/src/components/admin/ImageUploadInput";
import {
  getAiProviderSettings,
  getShopPaymentSettings,
  getSiteContentSettings,
  testAiProviderSettings,
  updateAiProviderSettings,
  updateShopPaymentSettings,
  updateSiteContentSettings,
} from "@/src/lib/api/settings";
import type {
  ApiAiProviderSettings,
  ApiShopPaymentSettings,
  ApiSiteContentSettings,
} from "@/src/lib/api/types";

const settingSections = [
  {
    description: "Control review gates for catalog changes before they appear in production booking flows.",
    icon: ShieldCheck,
    title: "Publishing controls",
    value: "Review required",
  },
  {
    description: "Route booking updates, payment exceptions, and supplier reminders to the operations queue.",
    icon: Bell,
    title: "Notifications",
    value: "Operations",
  },
  {
    description: "Keep team-level access grouped by sales, content, concierge, and operations workflows.",
    icon: KeyRound,
    title: "Access model",
    value: "Role based",
  },
  {
    description: "Tune default dashboard ranges, merchandising priorities, and admin table density.",
    icon: SlidersHorizontal,
    title: "Workspace defaults",
    value: "7-day view",
  },
] as const;

type FormState = {
  provider: "openai-compatible";
  baseUrl: string;
  model: string;
  enabled: boolean;
  apiKey: string;
};

type ShopPaymentFormState = {
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

type SiteContentFormState = {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactEmail: string;
  hotline: string;
  topBarNote: string;
  promoLabel: string;
  promoCta: string;
  promoHref: string;
  homeHeroImage: string;
  heroImageTwo: string;
  heroImageThree: string;
};

type StatusState = {
  type: "success" | "error";
  message: string;
};

const defaultForm: FormState = {
  provider: "openai-compatible",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
  enabled: false,
  apiKey: "",
};

const defaultShopPaymentForm: ShopPaymentFormState = {
  bankBin: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
};

const defaultSiteContentForm: SiteContentFormState = {
  siteName: "",
  siteTagline: "",
  siteDescription: "",
  contactEmail: "",
  hotline: "",
  topBarNote: "",
  promoLabel: "",
  promoCta: "",
  promoHref: "",
  homeHeroImage: "",
  heroImageTwo: "",
  heroImageThree: "",
};

function createFormFromSettings(settings: ApiAiProviderSettings): FormState {
  return {
    provider: settings.provider,
    baseUrl: settings.baseUrl,
    model: settings.model,
    enabled: settings.enabled,
    apiKey: "",
  };
}

function createSiteContentForm(settings: ApiSiteContentSettings): SiteContentFormState {
  return {
    siteName: settings.siteName,
    siteTagline: settings.siteTagline,
    siteDescription: settings.siteDescription,
    contactEmail: settings.contactEmail,
    hotline: settings.hotline,
    topBarNote: settings.topBarNote,
    promoLabel: settings.promoLabel,
    promoCta: settings.promoCta,
    promoHref: settings.promoHref,
    homeHeroImage: settings.homeHeroImage,
    heroImageTwo: settings.heroImageTwo,
    heroImageThree: settings.heroImageThree,
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ApiAiProviderSettings | null>(null);
  const [shopPaymentSettings, setShopPaymentSettings] = useState<ApiShopPaymentSettings | null>(null);
  const [siteContentSettings, setSiteContentSettings] = useState<ApiSiteContentSettings | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [shopPaymentForm, setShopPaymentForm] = useState<ShopPaymentFormState>(defaultShopPaymentForm);
  const [siteContentForm, setSiteContentForm] = useState<SiteContentFormState>(defaultSiteContentForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingShopPayment, setIsSavingShopPayment] = useState(false);
  const [isSavingSiteContent, setIsSavingSiteContent] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [wantsToClearKey, setWantsToClearKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<StatusState | null>(null);
  const [shopPaymentStatus, setShopPaymentStatus] = useState<StatusState | null>(null);
  const [siteContentStatus, setSiteContentStatus] = useState<StatusState | null>(null);
  const [testStatus, setTestStatus] = useState<StatusState | null>(null);

  const readiness = useMemo(
    () => [
      {
        label: "Provider setup",
        ready: form.provider === "openai-compatible",
      },
      {
        label: "Connection target",
        ready: form.baseUrl.trim().length > 0 && form.model.trim().length > 0,
      },
      {
        label: "Stored key",
        ready: Boolean(form.apiKey.trim()) || (settings?.hasApiKey === true && !wantsToClearKey),
      },
      {
        label: "AI enabled",
        ready: form.enabled,
      },
    ],
    [form, settings, wantsToClearKey],
  );

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      setSaveStatus(null);

      try {
        const [nextSettings, nextShopPaymentSettings, nextSiteContentSettings] = await Promise.all([
          getAiProviderSettings(),
          getShopPaymentSettings(),
          getSiteContentSettings(),
        ]);
        setSettings(nextSettings);
        setForm(createFormFromSettings(nextSettings));
        setShopPaymentSettings(nextShopPaymentSettings);
        setShopPaymentForm(nextShopPaymentSettings);
        setSiteContentSettings(nextSiteContentSettings);
        setSiteContentForm(createSiteContentForm(nextSiteContentSettings));
        setWantsToClearKey(false);
      } catch (error) {
        setSaveStatus({
          type: "error",
          message: error instanceof Error ? error.message : "Unable to load AI provider settings.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    void loadSettings();
  }, []);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaveStatus(null);
    setTestStatus(null);
  }

  function updateShopPaymentField<K extends keyof ShopPaymentFormState>(
    field: K,
    value: ShopPaymentFormState[K],
  ) {
    setShopPaymentForm((current) => ({ ...current, [field]: value }));
    setShopPaymentStatus(null);
  }

  function updateSiteContentField<K extends keyof SiteContentFormState>(
    field: K,
    value: SiteContentFormState[K],
  ) {
    setSiteContentForm((current) => ({ ...current, [field]: value }));
    setSiteContentStatus(null);
  }

  function validateForSubmit() {
    if (!form.baseUrl.trim()) {
      setSaveStatus({ type: "error", message: "Base URL is required." });
      return false;
    }

    if (!form.model.trim()) {
      setSaveStatus({ type: "error", message: "Model is required." });
      return false;
    }

    if (!form.apiKey.trim() && !settings?.hasApiKey && !wantsToClearKey) {
      setSaveStatus({ type: "error", message: "Add an API key before saving." });
      return false;
    }

    if (wantsToClearKey && !form.apiKey.trim() && !form.enabled) {
      return true;
    }

    return true;
  }

  function validateForTest() {
    if (!form.baseUrl.trim()) {
      setTestStatus({ type: "error", message: "Base URL is required for connection tests." });
      return false;
    }

    if (!form.model.trim()) {
      setTestStatus({ type: "error", message: "Model is required for connection tests." });
      return false;
    }

    if (!form.apiKey.trim()) {
      setTestStatus({ type: "error", message: "Enter an API key to run a connection test." });
      return false;
    }

    return true;
  }

  async function refreshSettings() {
    const [nextSettings, nextShopPaymentSettings, nextSiteContentSettings] = await Promise.all([
      getAiProviderSettings(),
      getShopPaymentSettings(),
      getSiteContentSettings(),
    ]);
    setSettings(nextSettings);
    setForm(createFormFromSettings(nextSettings));
    setShopPaymentSettings(nextShopPaymentSettings);
    setShopPaymentForm(nextShopPaymentSettings);
    setSiteContentSettings(nextSiteContentSettings);
    setSiteContentForm(createSiteContentForm(nextSiteContentSettings));
    setWantsToClearKey(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveStatus(null);

    if (!validateForSubmit()) {
      return;
    }

    setIsSaving(true);
    try {
      await updateAiProviderSettings({
        provider: form.provider,
        baseUrl: form.baseUrl.trim(),
        model: form.model.trim(),
        enabled: form.enabled,
        ...(form.apiKey.trim() ? { apiKey: form.apiKey.trim() } : {}),
        ...(wantsToClearKey ? { clearApiKey: true } : {}),
      });
      await refreshSettings();
      setSaveStatus({ type: "success", message: "AI provider settings saved." });
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save AI provider settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTestConnection() {
    setTestStatus(null);

    if (!validateForTest()) {
      return;
    }

    setIsTesting(true);
    try {
      const result = await testAiProviderSettings({
        provider: form.provider,
        baseUrl: form.baseUrl.trim(),
        model: form.model.trim(),
        apiKey: form.apiKey.trim(),
      });
      setTestStatus({
        type: "success",
        message: result.ok ? "Provider connection verified." : "Connection test returned an unexpected response.",
      });
    } catch (error) {
      setTestStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Connection test failed.",
      });
    } finally {
      setIsTesting(false);
    }
  }

  async function handleShopPaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShopPaymentStatus(null);

    if (
      !shopPaymentForm.bankBin.trim() ||
      !shopPaymentForm.bankName.trim() ||
      !shopPaymentForm.accountNumber.trim() ||
      !shopPaymentForm.accountName.trim()
    ) {
      setShopPaymentStatus({
        type: "error",
        message: "Complete the VietQR bank bin, bank name, account number, and account name before saving.",
      });
      return;
    }

    setIsSavingShopPayment(true);
    try {
      await updateShopPaymentSettings({
        bankBin: shopPaymentForm.bankBin.trim(),
        bankName: shopPaymentForm.bankName.trim(),
        accountNumber: shopPaymentForm.accountNumber.trim(),
        accountName: shopPaymentForm.accountName.trim(),
      });
      await refreshSettings();
      setShopPaymentStatus({
        type: "success",
        message: "Shop payment settings saved.",
      });
    } catch (error) {
      setShopPaymentStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save shop payment settings.",
      });
    } finally {
      setIsSavingShopPayment(false);
    }
  }

  async function handleSiteContentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSiteContentStatus(null);

    const requiredFields: Array<[string, string]> = [
      ["Site name", siteContentForm.siteName],
      ["Site tagline", siteContentForm.siteTagline],
      ["Site description", siteContentForm.siteDescription],
      ["Contact email", siteContentForm.contactEmail],
      ["Hotline", siteContentForm.hotline],
      ["Top bar note", siteContentForm.topBarNote],
      ["Promo label", siteContentForm.promoLabel],
      ["Promo CTA", siteContentForm.promoCta],
      ["Promo link", siteContentForm.promoHref],
      ["Hero image 1", siteContentForm.homeHeroImage],
      ["Hero image 2", siteContentForm.heroImageTwo],
      ["Hero image 3", siteContentForm.heroImageThree],
    ];

    const missingField = requiredFields.find(([, value]) => value.trim().length === 0);
    if (missingField) {
      setSiteContentStatus({
        type: "error",
        message: `${missingField[0]} is required before saving the website content settings.`,
      });
      return;
    }

    setIsSavingSiteContent(true);
    try {
      await updateSiteContentSettings({
        siteName: siteContentForm.siteName.trim(),
        siteTagline: siteContentForm.siteTagline.trim(),
        siteDescription: siteContentForm.siteDescription.trim(),
        contactEmail: siteContentForm.contactEmail.trim(),
        hotline: siteContentForm.hotline.trim(),
        topBarNote: siteContentForm.topBarNote.trim(),
        promoLabel: siteContentForm.promoLabel.trim(),
        promoCta: siteContentForm.promoCta.trim(),
        promoHref: siteContentForm.promoHref.trim(),
        homeHeroImage: siteContentForm.homeHeroImage.trim(),
        heroImageTwo: siteContentForm.heroImageTwo.trim(),
        heroImageThree: siteContentForm.heroImageThree.trim(),
      });
      await refreshSettings();
      setSiteContentStatus({
        type: "success",
        message: "Website content settings saved.",
      });
    } catch (error) {
      setSiteContentStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save website content settings.",
      });
    } finally {
      setIsSavingSiteContent(false);
    }
  }

  return (
    <AdminShell
      activePath="/admin/settings"
      dateLabel="Friday, May 01, 2026"
      pageTitle="Admin settings"
      searchPlaceholder="Search settings, roles, notification rules..."
      sectionLabel="Operational preferences for admin workflows, publishing, and team access."
      teamValue="operations"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {settingSections.map(({ description, icon: Icon, title, value }) => (
          <Card className="border-none bg-white" key={title}>
            <CardContent className="p-6">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-sm font-medium text-stone-500">{title}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-stone-950">{value}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_420px]">
        <div className="space-y-6">
          <form id="ai-settings-form" onSubmit={handleSubmit}>
            <Card>
            <CardContent className="space-y-6 p-6 sm:p-7">
              <SectionHeader
                eyebrow="Bring your own key"
                title="AI provider configuration"
                description="Store one site-wide OpenAI-compatible provider config for AI booking summaries. Booking creation still succeeds even if this provider is disabled or unavailable."
              />

              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="ai-provider">Provider</Label>
                      <Input id="ai-provider" value="OpenAI-compatible" disabled />
                    </div>
                    <div>
                      <Label htmlFor="ai-enabled">AI summary status</Label>
                      <button
                        aria-pressed={form.enabled}
                        className={
                          form.enabled
                            ? "flex h-10 w-full items-center justify-between rounded-md border border-emerald-300 bg-emerald-50 px-3 text-sm font-semibold text-emerald-950"
                            : "flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700"
                        }
                        id="ai-enabled"
                        onClick={() => updateField("enabled", !form.enabled)}
                        type="button"
                      >
                        <span>{form.enabled ? "Enabled" : "Disabled"}</span>
                        <span className={form.enabled ? "text-emerald-700" : "text-stone-400"}>
                          {form.enabled ? "AI booking summaries are active" : "Booking flow stays fail-open"}
                        </span>
                      </button>
                    </div>
                    <div>
                      <Label htmlFor="ai-base-url">Base URL</Label>
                      <Input
                        id="ai-base-url"
                        onChange={(event) => updateField("baseUrl", event.target.value)}
                        placeholder="https://api.openai.com/v1"
                        value={form.baseUrl}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-model">Model</Label>
                      <Input
                        id="ai-model"
                        onChange={(event) => updateField("model", event.target.value)}
                        placeholder="gpt-4o-mini"
                        value={form.model}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-stone-950">Stored API key</p>
                        <p className="mt-1 text-sm text-stone-500">
                          {settings?.hasApiKey
                            ? `A key ending in ${settings.apiKeyLast4 ?? "----"} is stored on the backend.`
                            : "No API key is currently stored."}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setWantsToClearKey((current) => !current);
                          setSaveStatus(null);
                          setTestStatus(null);
                        }}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 className="size-4" />
                        {wantsToClearKey ? "Keep stored key" : "Clear stored key"}
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="ai-api-key">New API key</Label>
                      <Input
                        id="ai-api-key"
                        onChange={(event) => updateField("apiKey", event.target.value)}
                        placeholder="sk-..."
                        type="password"
                        value={form.apiKey}
                      />
                      <p className="mt-2 text-xs font-medium text-stone-500">
                        Leave this blank to keep the current stored key. Enter a new key to replace it.
                      </p>
                    </div>
                  </div>

                  {testStatus ? <StatusCard status={testStatus} /> : null}
                  {saveStatus ? <StatusCard status={saveStatus} /> : null}
                </>
              )}
            </CardContent>
            </Card>
          </form>

          <Card>
            <CardContent className="space-y-6 p-6 sm:p-7">
              <SectionHeader
                eyebrow="Checkout payment"
                title="Shop VietQR configuration"
                description="These account details are used after checkout to generate the VietQR code customers scan in their banking app."
              />

              {isLoading ? (
                <LoadingState />
              ) : (
                <form className="space-y-6" onSubmit={handleShopPaymentSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="shop-bank-bin">Bank BIN</Label>
                      <Input
                        id="shop-bank-bin"
                        onChange={(event) => updateShopPaymentField("bankBin", event.target.value)}
                        placeholder="970436"
                        value={shopPaymentForm.bankBin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shop-bank-name">Bank name</Label>
                      <Input
                        id="shop-bank-name"
                        onChange={(event) => updateShopPaymentField("bankName", event.target.value)}
                        placeholder="Vietcombank"
                        value={shopPaymentForm.bankName}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shop-account-number">Account number</Label>
                      <Input
                        id="shop-account-number"
                        onChange={(event) => updateShopPaymentField("accountNumber", event.target.value)}
                        placeholder="0123456789"
                        value={shopPaymentForm.accountNumber}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shop-account-name">Account name</Label>
                      <Input
                        id="shop-account-name"
                        onChange={(event) => updateShopPaymentField("accountName", event.target.value)}
                        placeholder="CURATOR TRAVEL LTD"
                        value={shopPaymentForm.accountName}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-950">
                    The booking code is added automatically to the transfer note. Customers only see the QR code after they complete traveler details and submit checkout.
                  </div>

                  {shopPaymentStatus ? <StatusCard status={shopPaymentStatus} /> : null}

                  <div className="flex justify-end">
                    <Button disabled={isSavingShopPayment || isLoading} type="submit">
                      {isSavingShopPayment ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                      {isSavingShopPayment ? "Saving..." : "Save VietQR settings"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6 p-6 sm:p-7">
              <SectionHeader
                eyebrow="Website content"
                title="Brand, contact, and hero settings"
                description="Non-technical admins can update the homepage hero images, website branding, and public contact details from here."
              />

              {isLoading ? (
                <LoadingState />
              ) : (
                <form className="space-y-6" onSubmit={handleSiteContentSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="site-name">Site name</Label>
                      <Input
                        id="site-name"
                        onChange={(event) => updateSiteContentField("siteName", event.target.value)}
                        placeholder="CURATOR"
                        value={siteContentForm.siteName}
                      />
                    </div>
                    <div>
                      <Label htmlFor="site-tagline">Site tagline</Label>
                      <Input
                        id="site-tagline"
                        onChange={(event) => updateSiteContentField("siteTagline", event.target.value)}
                        placeholder="High-End Travel Monograph"
                        value={siteContentForm.siteTagline}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="site-description">Site description</Label>
                    <Textarea
                      id="site-description"
                      onChange={(event) => updateSiteContentField("siteDescription", event.target.value)}
                      placeholder="Curated destinations and exclusive travel experiences."
                      rows={4}
                      value={siteContentForm.siteDescription}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="contact-email">Contact email</Label>
                      <Input
                        id="contact-email"
                        onChange={(event) => updateSiteContentField("contactEmail", event.target.value)}
                        placeholder="inquiries@curator.travel"
                        value={siteContentForm.contactEmail}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hotline">Hotline</Label>
                      <Input
                        id="hotline"
                        onChange={(event) => updateSiteContentField("hotline", event.target.value)}
                        placeholder="Hotline: +44 (0) 20 7123 4567"
                        value={siteContentForm.hotline}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="top-bar-note">Top bar note</Label>
                      <Input
                        id="top-bar-note"
                        onChange={(event) => updateSiteContentField("topBarNote", event.target.value)}
                        placeholder="Private itinerary support, 24/7"
                        value={siteContentForm.topBarNote}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promo-label">Promo label</Label>
                      <Input
                        id="promo-label"
                        onChange={(event) => updateSiteContentField("promoLabel", event.target.value)}
                        placeholder="Travel freely without worrying about the price"
                        value={siteContentForm.promoLabel}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promo-cta">Promo CTA</Label>
                      <Input
                        id="promo-cta"
                        onChange={(event) => updateSiteContentField("promoCta", event.target.value)}
                        placeholder="View offers"
                        value={siteContentForm.promoCta}
                      />
                    </div>
                    <div>
                      <Label htmlFor="promo-href">Promo link</Label>
                      <Input
                        id="promo-href"
                        onChange={(event) => updateSiteContentField("promoHref", event.target.value)}
                        placeholder="/tours"
                        value={siteContentForm.promoHref}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-bold text-stone-950">Homepage hero images</p>
                    <p className="text-sm leading-relaxed text-stone-500">
                      These three images rotate in the hero carousel on the homepage. Use direct image URLs.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <ImageUploadInput
                          id="hero-image-one"
                          label="Hero image 1 URL"
                          value={siteContentForm.homeHeroImage}
                          onChange={(value) => updateSiteContentField("homeHeroImage", value)}
                        />
                      </div>
                      <div>
                        <ImageUploadInput
                          id="hero-image-two"
                          label="Hero image 2 URL"
                          value={siteContentForm.heroImageTwo}
                          onChange={(value) => updateSiteContentField("heroImageTwo", value)}
                        />
                      </div>
                      <div>
                        <ImageUploadInput
                          id="hero-image-three"
                          label="Hero image 3 URL"
                          value={siteContentForm.heroImageThree}
                          onChange={(value) => updateSiteContentField("heroImageThree", value)}
                        />
                      </div>
                    </div>
                  </div>

                  {siteContentStatus ? <StatusCard status={siteContentStatus} /> : null}

                  <div className="flex justify-end">
                    <Button disabled={isSavingSiteContent || isLoading} type="submit">
                      {isSavingSiteContent ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                      {isSavingSiteContent ? "Saving..." : "Save website content"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="border-none bg-stone-950 text-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.85)]">
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
                    AI readiness
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    {readiness.filter((item) => item.ready).length} of {readiness.length} checks ready
                  </h3>
                </div>
                <Sparkles className="size-6 text-emerald-200" />
              </div>

              <div className="mt-6 space-y-3">
                {readiness.map((item) => (
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3" key={item.label}>
                    <span className="text-sm font-semibold">{item.label}</span>
                    {item.ready ? (
                      <CheckCircle2 className="size-4 text-emerald-200" />
                    ) : (
                      <CircleAlert className="size-4 text-white/45" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 p-6 sm:p-7">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
                  Current state
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {form.enabled ? "AI booking summaries enabled" : "AI booking summaries disabled"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  Booking creation never blocks on AI. This provider only adds an admin-only summary after the booking is persisted.
                </p>
              </div>

              <SummaryPill label="Provider" value="OpenAI-compatible" />
              <SummaryPill label="Base URL" value={form.baseUrl || "Not set"} />
              <SummaryPill label="Model" value={form.model || "Not set"} />
              <SummaryPill
                label="Stored key"
                value={
                  wantsToClearKey
                    ? "Will be cleared on save"
                    : settings?.hasApiKey
                      ? `Ending in ${settings.apiKeyLast4 ?? "----"}`
                      : "Not stored"
                }
              />

              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
                <Button disabled={isTesting || isLoading} onClick={handleTestConnection} type="button" variant="outline">
                  {isTesting ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  {isTesting ? "Testing..." : "Test connection"}
                </Button>
                <Button disabled={isSaving || isLoading} form="ai-settings-form" type="submit">
                  {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {isSaving ? "Saving..." : "Save settings"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
                    Customer payment
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                    VietQR checkout
                  </h3>
                </div>
                <Landmark className="size-5 text-emerald-800" />
              </div>

              <SummaryPill label="Bank BIN" value={shopPaymentSettings?.bankBin ?? "Not set"} />
              <SummaryPill label="Bank name" value={shopPaymentSettings?.bankName ?? "Not set"} />
              <SummaryPill label="Account number" value={shopPaymentSettings?.accountNumber ?? "Not set"} />
              <SummaryPill label="Account name" value={shopPaymentSettings?.accountName ?? "Not set"} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5 p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
                    Public website
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                    Editable site content
                  </h3>
                </div>
                <Globe2 className="size-5 text-emerald-800" />
              </div>

              <SummaryPill label="Site name" value={siteContentSettings?.siteName ?? "Not set"} />
              <SummaryPill label="Contact email" value={siteContentSettings?.contactEmail ?? "Not set"} />
              <SummaryPill label="Hotline" value={siteContentSettings?.hotline ?? "Not set"} />
              <SummaryPill label="Hero carousel" value="3 managed images" />
              <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-4 text-sm leading-relaxed text-stone-500">
                The homepage logo, hero carousel, top bars, metadata, and public contact blocks now read from backend-managed settings.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AdminShell>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-medium text-stone-600">
      <LoaderCircle className="size-4 animate-spin" />
      Loading settings...
    </div>
  );
}

function StatusCard({ status }: Readonly<{ status: StatusState }>) {
  const tone =
    status.type === "success"
      ? "border-none bg-emerald-100 text-emerald-950"
      : "border-none bg-rose-100 text-rose-950";

  return (
    <Card aria-live="polite" className={tone} role={status.type === "success" ? "status" : "alert"}>
      <CardContent className="flex gap-3 p-5 text-sm font-semibold">
        {status.type === "success" ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <CircleAlert className="mt-0.5 size-5 shrink-0" />}
        <p>{status.message}</p>
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
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}
