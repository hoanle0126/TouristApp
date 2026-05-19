import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutPageDto } from './dto/update-about-page.dto';

const SINGLETON_ID = 'about';

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_HERO_ALT =
  'Minimalist modern architecture with clean lines and soft natural light';
const DEFAULT_HERO_TITLE = 'The Art of Curated Journeys';
const DEFAULT_HERO_SUBTITLE =
  'We transcend the ordinary to define the exceptional in modern travel.';
const DEFAULT_STORY_IMAGE =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_STORY_ALT = 'Ancient courtyard with curved walls';
const DEFAULT_STORY_HEADING = 'A Decade of Defining Discovery';
const DEFAULT_STORY_BODY = [
  'Founded in 2015, our journey began with a simple, defiant idea: that the most profound travel experiences cannot be found in a brochure.',
  'Today, we are an independent, family-owned atelier, partnering with a global network of artisans, historians, and conservationists to design private journeys that align with your specific intellectual and aesthetic curiosity.',
];
const DEFAULT_STORY_CTA = 'Learn about our philosophy';
const DEFAULT_MISSION =
  'To provide discerning travelers with access to unreachable moments through rigorous curation and an unwavering commitment to quality over quantity.';
const DEFAULT_VISION =
  'To redefine luxury as an experience of profound, intentional engagement with culture, nature, and human craftsmanship.';
const DEFAULT_CURATORS = [
  {
    name: 'Julian Thorne',
    role: 'Lead Curator, Mediterranean',
    bio: 'Specializing in coastal architecture and the revival of ancient trade routes through modern sailing.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    alt: 'Portrait of Julian Thorne',
  },
  {
    name: 'Elena Moretti',
    role: 'Design & Gastronomy Lead',
    bio: 'Former food editor focused on farm-to-table narratives and high-altitude vineyard experiences.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    alt: 'Portrait of Elena Moretti',
  },
  {
    name: 'Arthur Vance',
    role: 'Expedition Strategist',
    bio: 'Expert in remote wilderness logistics and conservation-led safaris in sub-Saharan Africa.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    alt: 'Portrait of Arthur Vance',
  },
];
const DEFAULT_PHILOSOPHY = [
  {
    title: 'Slow Travel',
    description:
      'We believe the fastest way to understand a place is to slow down and listen to its quiet rhythms.',
    icon: 'nature' as const,
  },
  {
    title: 'Bespoke Craft',
    description:
      'Every itinerary is a one-of-a-kind composition tailored to a single traveler or party.',
    icon: 'sparkle' as const,
  },
  {
    title: 'Conservation',
    description:
      'A portion of every journey funds conservation and community projects in the regions we visit.',
    icon: 'leaf' as const,
  },
];
const DEFAULT_CTA = 'Your next story begins with a single step.';
const DEFAULT_CTA_BUTTON = 'Start Your Journey';

type AboutPageReadModel = {
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
  curators: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
    alt: string;
  }>;
  philosophy: Array<{
    title: string;
    description: string;
    icon: 'nature' | 'sparkle' | 'leaf';
  }>;
  cta: string;
  ctaButtonLabel: string;
};

@Injectable()
export class AboutPageService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<AboutPageReadModel> {
    const config = await this.prisma.aboutPageContent.findUnique({
      where: { id: SINGLETON_ID },
    });
    return this.toReadModel(config);
  }

  async update(dto: UpdateAboutPageDto): Promise<AboutPageReadModel> {
    const config = await this.prisma.aboutPageContent.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        heroImage: dto.heroImage,
        heroAlt: dto.heroAlt,
        heroTitle: dto.heroTitle,
        heroSubtitle: dto.heroSubtitle,
        storyImage: dto.storyImage,
        storyAlt: dto.storyAlt,
        storyHeading: dto.storyHeading,
        storyBody: dto.storyBody as unknown as Prisma.InputJsonValue,
        storyCtaLabel: dto.storyCtaLabel,
        mission: dto.mission,
        vision: dto.vision,
        curators: dto.curators as unknown as Prisma.InputJsonValue,
        philosophy: dto.philosophy as unknown as Prisma.InputJsonValue,
        cta: dto.cta,
        ctaButtonLabel: dto.ctaButtonLabel,
      },
      update: {
        heroImage: dto.heroImage,
        heroAlt: dto.heroAlt,
        heroTitle: dto.heroTitle,
        heroSubtitle: dto.heroSubtitle,
        storyImage: dto.storyImage,
        storyAlt: dto.storyAlt,
        storyHeading: dto.storyHeading,
        storyBody: dto.storyBody as unknown as Prisma.InputJsonValue,
        storyCtaLabel: dto.storyCtaLabel,
        mission: dto.mission,
        vision: dto.vision,
        curators: dto.curators as unknown as Prisma.InputJsonValue,
        philosophy: dto.philosophy as unknown as Prisma.InputJsonValue,
        cta: dto.cta,
        ctaButtonLabel: dto.ctaButtonLabel,
      },
    });

    return this.toReadModel(config);
  }

  private toReadModel(
    config: {
      heroImage: string;
      heroAlt: string;
      heroTitle: string;
      heroSubtitle: string;
      storyImage: string;
      storyAlt: string;
      storyHeading: string;
      storyBody: Prisma.JsonValue;
      storyCtaLabel: string;
      mission: string;
      vision: string;
      curators: Prisma.JsonValue;
      philosophy: Prisma.JsonValue;
      cta: string;
      ctaButtonLabel: string;
    } | null,
  ): AboutPageReadModel {
    return {
      heroImage: config?.heroImage ?? DEFAULT_HERO_IMAGE,
      heroAlt: config?.heroAlt ?? DEFAULT_HERO_ALT,
      heroTitle: config?.heroTitle ?? DEFAULT_HERO_TITLE,
      heroSubtitle: config?.heroSubtitle ?? DEFAULT_HERO_SUBTITLE,
      storyImage: config?.storyImage ?? DEFAULT_STORY_IMAGE,
      storyAlt: config?.storyAlt ?? DEFAULT_STORY_ALT,
      storyHeading: config?.storyHeading ?? DEFAULT_STORY_HEADING,
      storyBody: (config?.storyBody as string[] | undefined) ?? DEFAULT_STORY_BODY,
      storyCtaLabel: config?.storyCtaLabel ?? DEFAULT_STORY_CTA,
      mission: config?.mission ?? DEFAULT_MISSION,
      vision: config?.vision ?? DEFAULT_VISION,
      curators:
        (config?.curators as AboutPageReadModel['curators'] | undefined) ??
        DEFAULT_CURATORS,
      philosophy:
        (config?.philosophy as AboutPageReadModel['philosophy'] | undefined) ??
        DEFAULT_PHILOSOPHY,
      cta: config?.cta ?? DEFAULT_CTA,
      ctaButtonLabel: config?.ctaButtonLabel ?? DEFAULT_CTA_BUTTON,
    };
  }
}
