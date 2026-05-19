import { apiFetch } from "@/src/lib/api/client";

export type AboutPageContent = {
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly storyImage: string;
  readonly storyAlt: string;
  readonly storyHeading: string;
  readonly storyBody: readonly string[];
  readonly storyCtaLabel: string;
  readonly mission: string;
  readonly vision: string;
  readonly curators: readonly {
    readonly name: string;
    readonly role: string;
    readonly bio: string;
    readonly image: string;
    readonly alt: string;
  }[];
  readonly philosophy: readonly {
    readonly title: string;
    readonly description: string;
    readonly icon: "nature" | "sparkle" | "leaf";
  }[];
  readonly cta: string;
  readonly ctaButtonLabel: string;
};

export async function getAboutPage() {
  return apiFetch<AboutPageContent>("/about-page", { cache: "no-store" });
}

export async function updateAboutPage(input: AboutPageContent) {
  return apiFetch<AboutPageContent>("/about-page", {
    body: input,
    cache: "no-store",
    method: "PUT",
  });
}
