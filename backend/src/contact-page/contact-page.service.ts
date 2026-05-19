import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateContactPageDto } from './dto/update-contact-page.dto';

const SINGLETON_ID = 'contact';

const DEFAULT_HERO_TITLE = 'Get in Touch';
const DEFAULT_HERO_SUBTITLE =
  'Whether you are seeking inspiration for your next journey or ready to begin planning a bespoke itinerary, our curators are here to guide you.';
const DEFAULT_FORM_TITLE = 'Send an Inquiry';
const DEFAULT_FORM_SUBTITLE =
  'Share details about your desired journey, and a dedicated curator will be in touch within 24 hours.';
const DEFAULT_OFFICES = [
  {
    name: 'London HQ',
    address: ['15 St George Street', 'Mayfair, London W1S 1FH', 'United Kingdom'],
  },
  {
    name: 'Kyoto Atelier',
    address: [
      '234 Gionmachi Kitagawa',
      'Higashiyama Ward, Kyoto 605-0073',
      'Japan',
    ],
  },
];
const DEFAULT_DEPARTMENTS = [
  { name: 'Press & Media', email: 'press@curator.travel' },
  { name: 'Partnerships', email: 'partners@curator.travel' },
];
const DEFAULT_MAP_IMAGE =
  'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1600&q=80';
const DEFAULT_MAP_ALT = 'Aerial map view of central London';
const DEFAULT_MAP_TITLE = 'Visit our London HQ';
const DEFAULT_MAP_NOTE =
  'Appointments are highly recommended to ensure a dedicated curator is available to assist you.';

type ContactPageReadModel = {
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  offices: Array<{ name: string; address: string[] }>;
  departments: Array<{ name: string; email: string }>;
  mapImage: string;
  mapAlt: string;
  mapTitle: string;
  mapNote: string;
};

@Injectable()
export class ContactPageService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<ContactPageReadModel> {
    const config = await this.prisma.contactPageContent.findUnique({
      where: { id: SINGLETON_ID },
    });
    return this.toReadModel(config);
  }

  async update(dto: UpdateContactPageDto): Promise<ContactPageReadModel> {
    const config = await this.prisma.contactPageContent.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        heroTitle: dto.heroTitle,
        heroSubtitle: dto.heroSubtitle,
        formTitle: dto.formTitle,
        formSubtitle: dto.formSubtitle,
        offices: dto.offices as unknown as Prisma.InputJsonValue,
        departments: dto.departments as unknown as Prisma.InputJsonValue,
        mapImage: dto.mapImage,
        mapAlt: dto.mapAlt,
        mapTitle: dto.mapTitle,
        mapNote: dto.mapNote,
      },
      update: {
        heroTitle: dto.heroTitle,
        heroSubtitle: dto.heroSubtitle,
        formTitle: dto.formTitle,
        formSubtitle: dto.formSubtitle,
        offices: dto.offices as unknown as Prisma.InputJsonValue,
        departments: dto.departments as unknown as Prisma.InputJsonValue,
        mapImage: dto.mapImage,
        mapAlt: dto.mapAlt,
        mapTitle: dto.mapTitle,
        mapNote: dto.mapNote,
      },
    });

    return this.toReadModel(config);
  }

  private toReadModel(
    config: {
      heroTitle: string;
      heroSubtitle: string;
      formTitle: string;
      formSubtitle: string;
      offices: Prisma.JsonValue;
      departments: Prisma.JsonValue;
      mapImage: string;
      mapAlt: string;
      mapTitle: string;
      mapNote: string;
    } | null,
  ): ContactPageReadModel {
    return {
      heroTitle: config?.heroTitle ?? DEFAULT_HERO_TITLE,
      heroSubtitle: config?.heroSubtitle ?? DEFAULT_HERO_SUBTITLE,
      formTitle: config?.formTitle ?? DEFAULT_FORM_TITLE,
      formSubtitle: config?.formSubtitle ?? DEFAULT_FORM_SUBTITLE,
      offices:
        (config?.offices as ContactPageReadModel['offices'] | undefined) ??
        DEFAULT_OFFICES,
      departments:
        (config?.departments as
          | ContactPageReadModel['departments']
          | undefined) ?? DEFAULT_DEPARTMENTS,
      mapImage: config?.mapImage ?? DEFAULT_MAP_IMAGE,
      mapAlt: config?.mapAlt ?? DEFAULT_MAP_ALT,
      mapTitle: config?.mapTitle ?? DEFAULT_MAP_TITLE,
      mapNote: config?.mapNote ?? DEFAULT_MAP_NOTE,
    };
  }
}
