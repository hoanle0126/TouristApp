import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

type BlogRecord = Prisma.BlogPostGetPayload<{
  include: {
    mentionedDestinations: true;
    mentionedHotels: true;
    mentionedTours: true;
  };
}>;

type MentionInput = {
  mentionedDestinationSlugs?: string[];
  mentionedHotelSlugs?: string[];
  mentionedTourSlugs?: string[];
};

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: {
      category?: string;
      destination?: string;
      tour?: string;
      hotel?: string;
      search?: string;
      perPage?: number;
    } = {},
  ) {
    const blogs = await this.prisma.blogPost.findMany({
      where: this.buildPublicWhere(filters),
      include: this.includeMentions(),
      orderBy: { publishedAt: 'desc' },
      take: filters.perPage,
    });

    return blogs.map((blog) => this.toCardResponse(blog));
  }

  async findOne(slug: string) {
    const blog = await this.prisma.blogPost.findFirst({
      where: { slug, status: 'published' },
      include: this.includeMentions(),
    });

    if (!blog) {
      throw new NotFoundException(`Blog ${slug} was not found.`);
    }

    return this.toDetailResponse(blog);
  }

  async create(dto: CreateBlogDto) {
    const {
      mentionedDestinationSlugs,
      mentionedHotelSlugs,
      mentionedTourSlugs,
      ...data
    } = dto;
    const blog = await this.prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: new Date(data.publishedAt),
        ...this.toMentionData({
          mentionedDestinationSlugs,
          mentionedHotelSlugs,
          mentionedTourSlugs,
        }),
      },
      include: this.includeMentions(),
    });

    return this.toDetailResponse(blog);
  }

  async update(slug: string, dto: UpdateBlogDto) {
    await this.findEditableBlog(slug);
    const {
      mentionedDestinationSlugs,
      mentionedHotelSlugs,
      mentionedTourSlugs,
      ...data
    } = dto;
    const blog = await this.prisma.blogPost.update({
      where: { slug },
      data: {
        ...data,
        ...(data.publishedAt
          ? { publishedAt: new Date(data.publishedAt) }
          : {}),
        ...this.toMentionData(
          {
            mentionedDestinationSlugs,
            mentionedHotelSlugs,
            mentionedTourSlugs,
          },
          true,
        ),
      },
      include: this.includeMentions(),
    });

    return this.toDetailResponse(blog);
  }

  async remove(slug: string) {
    await this.findEditableBlog(slug);
    await this.prisma.blogPost.delete({ where: { slug } });
    return { deleted: true, slug };
  }

  private buildPublicWhere(filters: {
    category?: string;
    destination?: string;
    tour?: string;
    hotel?: string;
    search?: string;
  }) {
    return {
      status: 'published',
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.destination
        ? { mentionedDestinations: { some: { slug: filters.destination } } }
        : {}),
      ...(filters.tour
        ? { mentionedTours: { some: { slug: filters.tour } } }
        : {}),
      ...(filters.hotel
        ? { mentionedHotels: { some: { slug: filters.hotel } } }
        : {}),
      ...(filters.search
        ? {
            OR: [
              {
                title: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                excerpt: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                intro: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    } satisfies Prisma.BlogPostWhereInput;
  }

  private async findEditableBlog(slug: string) {
    const blog = await this.prisma.blogPost.findUnique({ where: { slug } });

    if (!blog) {
      throw new NotFoundException(`Blog ${slug} was not found.`);
    }

    return blog;
  }

  private includeMentions() {
    return {
      mentionedDestinations: true,
      mentionedHotels: true,
      mentionedTours: true,
    } as const;
  }

  private toMentionData(input: MentionInput, replace = false) {
    return {
      ...(input.mentionedDestinationSlugs
        ? {
            mentionedDestinations: {
              [replace ? 'set' : 'connect']:
                input.mentionedDestinationSlugs.map((slug) => ({ slug })),
            },
          }
        : {}),
      ...(input.mentionedHotelSlugs
        ? {
            mentionedHotels: {
              [replace ? 'set' : 'connect']: input.mentionedHotelSlugs.map(
                (slug) => ({ slug }),
              ),
            },
          }
        : {}),
      ...(input.mentionedTourSlugs
        ? {
            mentionedTours: {
              [replace ? 'set' : 'connect']: input.mentionedTourSlugs.map(
                (slug) => ({ slug }),
              ),
            },
          }
        : {}),
    };
  }

  private toDestinationResponse(
    destination: BlogRecord['mentionedDestinations'][number],
  ) {
    return {
      slug: destination.slug,
      title: destination.title,
      href: destination.href,
      market: destination.market,
    };
  }

  private toHotelResponse(hotel: BlogRecord['mentionedHotels'][number]) {
    return {
      slug: hotel.slug,
      name: hotel.name,
      href: `/hotels/${hotel.slug}`,
      location: hotel.location,
      price: hotel.price,
    };
  }

  private toTourResponse(tour: BlogRecord['mentionedTours'][number]) {
    return {
      slug: tour.slug,
      title: tour.title,
      href: `/tours/${tour.slug}`,
      type: tour.type,
      duration: tour.duration,
    };
  }

  private toCardResponse(blog: BlogRecord) {
    return {
      slug: blog.slug,
      href: `/blog/${blog.slug}`,
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      image: blog.image,
      alt: blog.alt,
      author: blog.author,
      date: blog.publishedAt.toISOString(),
      publishedAt: blog.publishedAt.toISOString(),
      readingTime: blog.readingTime,
      mentionedDestinations: blog.mentionedDestinations.map((destination) =>
        this.toDestinationResponse(destination),
      ),
      mentionedTours: blog.mentionedTours.map((tour) =>
        this.toTourResponse(tour),
      ),
      mentionedHotels: blog.mentionedHotels.map((hotel) =>
        this.toHotelResponse(hotel),
      ),
    };
  }

  private toDetailResponse(blog: BlogRecord) {
    return {
      ...this.toCardResponse(blog),
      heroImage: blog.heroImage,
      heroAlt: blog.heroAlt,
      intro: blog.intro,
      meta: blog.meta,
      quote: blog.quote,
      sections: blog.sections,
      inlineImage: blog.inlineImage,
      secondaryFeature: blog.secondaryFeature,
      relatedPosts: blog.relatedPosts,
      seo: blog.seo,
    };
  }
}
