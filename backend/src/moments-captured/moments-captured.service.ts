import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMomentCapturedDto } from './dto/create-moment-captured.dto';
import { UpdateMomentCapturedDto } from './dto/update-moment-captured.dto';

@Injectable()
export class MomentsCapturedService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const moments = await this.prisma.momentCaptured.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return moments.map((moment) => this.toResponse(moment));
  }

  async create(dto: CreateMomentCapturedDto) {
    const moment = await this.prisma.momentCaptured.create({ data: dto });
    return this.toResponse(moment);
  }

  async update(id: string, dto: UpdateMomentCapturedDto) {
    await this.findExisting(id);
    const moment = await this.prisma.momentCaptured.update({
      data: dto,
      where: { id },
    });
    return this.toResponse(moment);
  }

  async remove(id: string) {
    await this.findExisting(id);
    await this.prisma.momentCaptured.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async findExisting(id: string) {
    const moment = await this.prisma.momentCaptured.findUnique({
      where: { id },
    });

    if (!moment) {
      throw new NotFoundException(`Captured moment ${id} was not found.`);
    }

    return moment;
  }

  private toResponse(moment: Awaited<ReturnType<PrismaService['momentCaptured']['findUnique']>>) {
    if (!moment) {
      throw new NotFoundException('Captured moment was not found.');
    }

    return {
      country: moment.country,
      id: moment.id,
      image: moment.image,
      sortOrder: moment.sortOrder,
      title: moment.title,
      wide: moment.wide,
    };
  }
}
