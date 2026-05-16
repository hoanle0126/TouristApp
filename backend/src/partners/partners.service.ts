import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const partners = await this.prisma.partner.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return partners.map((partner) => this.toResponse(partner));
  }

  async create(dto: CreatePartnerDto) {
    const partner = await this.prisma.partner.create({ data: dto });
    return this.toResponse(partner);
  }

  async update(id: string, dto: UpdatePartnerDto) {
    await this.findExisting(id);
    const partner = await this.prisma.partner.update({
      data: dto,
      where: { id },
    });
    return this.toResponse(partner);
  }

  async remove(id: string) {
    await this.findExisting(id);
    await this.prisma.partner.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async findExisting(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });

    if (!partner) {
      throw new NotFoundException(`Partner ${id} was not found.`);
    }

    return partner;
  }

  private toResponse(
    partner: Awaited<ReturnType<PrismaService['partner']['findUnique']>>,
  ) {
    if (!partner) {
      throw new NotFoundException('Partner was not found.');
    }

    return {
      description: partner.description,
      id: partner.id,
      name: partner.name,
      sortOrder: partner.sortOrder,
    };
  }
}
