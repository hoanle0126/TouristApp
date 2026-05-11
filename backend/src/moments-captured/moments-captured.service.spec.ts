import { NotFoundException } from '@nestjs/common';
import { MomentsCapturedService } from './moments-captured.service';

const momentRecord = {
  id: 'moment_1',
  title: 'Ubud Sanctuary',
  country: 'Indonesia',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCXt_uOk39Ti37dURaaAO9Gv1kYVRVrW8XysehQZYZ-kt8ZIZ2bwtsNbCd8AQ10u4z3Ws-ygeCNJUv5Gop1UT63u6X8MxMOwsc3rhdMRY3tsgjeEe7qMzcd2149-FycyLeFDO7xpx9kcEWk2_fS8DKpX_9kDbN7JeuBgbv1G_I2vQxg6YBjFVxc2nyFZne7rAd3m-oBrS93hnfaOSPn5-SrDsWnmzW4Kbf9FhEm3BsIhBf9ZX3-3YD5FUAC77BSp5tPXQZqXBkT11Kv',
  alt: 'Luxurious infinity pool overlooking tropical jungle in Bali at sunset',
  wide: false,
  sortOrder: 10,
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function createPrismaMock() {
  return {
    momentCaptured: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('MomentsCapturedService', () => {
  it('returns frontend-friendly moments ordered for the landing page', async () => {
    const prisma = createPrismaMock();
    prisma.momentCaptured.findMany.mockResolvedValue([momentRecord]);
    const service = new MomentsCapturedService(prisma as never);

    await expect(service.findAll()).resolves.toEqual([
      {
        alt: momentRecord.alt,
        country: momentRecord.country,
        id: momentRecord.id,
        image: momentRecord.image,
        sortOrder: momentRecord.sortOrder,
        title: momentRecord.title,
        wide: momentRecord.wide,
      },
    ]);
    expect(prisma.momentCaptured.findMany).toHaveBeenCalledWith({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  });

  it('creates a new captured moment', async () => {
    const prisma = createPrismaMock();
    prisma.momentCaptured.create.mockResolvedValue(momentRecord);
    const service = new MomentsCapturedService(prisma as never);

    await expect(
      service.create({
        alt: momentRecord.alt,
        country: momentRecord.country,
        image: momentRecord.image,
        sortOrder: momentRecord.sortOrder,
        title: momentRecord.title,
        wide: momentRecord.wide,
      }),
    ).resolves.toEqual({
      alt: momentRecord.alt,
      country: momentRecord.country,
      id: momentRecord.id,
      image: momentRecord.image,
      sortOrder: momentRecord.sortOrder,
      title: momentRecord.title,
      wide: momentRecord.wide,
    });
  });

  it('updates an existing captured moment', async () => {
    const prisma = createPrismaMock();
    prisma.momentCaptured.findUnique.mockResolvedValue(momentRecord);
    prisma.momentCaptured.update.mockResolvedValue({
      ...momentRecord,
      country: 'Greece',
      sortOrder: 20,
      title: 'Oia Heights',
      wide: true,
    });
    const service = new MomentsCapturedService(prisma as never);

    await expect(
      service.update(momentRecord.id, {
        alt: momentRecord.alt,
        country: 'Greece',
        image: momentRecord.image,
        sortOrder: 20,
        title: 'Oia Heights',
        wide: true,
      }),
    ).resolves.toEqual({
      alt: momentRecord.alt,
      country: 'Greece',
      id: momentRecord.id,
      image: momentRecord.image,
      sortOrder: 20,
      title: 'Oia Heights',
      wide: true,
    });
  });

  it('rejects updating an unknown captured moment', async () => {
    const prisma = createPrismaMock();
    prisma.momentCaptured.findUnique.mockResolvedValue(null);
    const service = new MomentsCapturedService(prisma as never);

    await expect(
      service.update('missing', {
        alt: momentRecord.alt,
        country: momentRecord.country,
        image: momentRecord.image,
        sortOrder: momentRecord.sortOrder,
        title: momentRecord.title,
        wide: momentRecord.wide,
      }),
    ).rejects.toThrow(
      new NotFoundException('Captured moment missing was not found.'),
    );
    expect(prisma.momentCaptured.update).not.toHaveBeenCalled();
  });

  it('deletes an existing captured moment', async () => {
    const prisma = createPrismaMock();
    prisma.momentCaptured.findUnique.mockResolvedValue(momentRecord);
    const service = new MomentsCapturedService(prisma as never);

    await expect(service.remove(momentRecord.id)).resolves.toEqual({
      deleted: true,
      id: momentRecord.id,
    });
    expect(prisma.momentCaptured.delete).toHaveBeenCalledWith({
      where: { id: momentRecord.id },
    });
  });
});
