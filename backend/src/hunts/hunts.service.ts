import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HuntsService {
  constructor(private prisma: PrismaService) {}

  async findActiveHunts() {
    const now = new Date();
    return this.prisma.hunt.findMany({
      where: {
        status: 'ACTIVE',
        AND: [
          {
            OR: [
              { startAt: null },
              { startAt: { lte: now } },
            ],
          },
          {
            OR: [
              { endAt: null },
              { endAt: { gte: now } },
            ],
          },
        ],
      },
      include: {
        business: true,
        lootBoxes: {
          where: { isActive: true },
        },
      },
    });
  }
}
