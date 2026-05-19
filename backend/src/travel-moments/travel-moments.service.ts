import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTravelMomentDto } from './dto/create-travel-moment.dto';
import { UpdateTravelMomentDto } from './dto/update-travel-moment.dto';

@Injectable()
export class TravelMomentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const moments = await this.prisma.travelMoment.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return moments.map((moment) => this.toResponse(moment));
  }

  async create(dto: CreateTravelMomentDto) {
    const moment = await this.prisma.travelMoment.create({ data: dto });
    return this.toResponse(moment);
  }

  async update(id: string, dto: UpdateTravelMomentDto) {
    await this.findExisting(id);
    const moment = await this.prisma.travelMoment.update({
      data: dto,
      where: { id },
    });
    return this.toResponse(moment);
  }

  async remove(id: string) {
    await this.findExisting(id);
    await this.prisma.travelMoment.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async findExisting(id: string) {
    const moment = await this.prisma.travelMoment.findUnique({
      where: { id },
    });

    if (!moment) {
      throw new NotFoundException(`Travel moment ${id} was not found.`);
    }

    return moment;
  }

  private toResponse(
    moment: Awaited<ReturnType<PrismaService['travelMoment']['findUnique']>>,
  ) {
    if (!moment) {
      throw new NotFoundException('Travel moment was not found.');
    }

    return {
      id: moment.id,
      image: moment.image,
      alt: moment.alt,
      caption: moment.caption,
      sortOrder: moment.sortOrder,
    };
  }
}
