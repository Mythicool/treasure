import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LootBoxesService {
  constructor(private prisma: PrismaService) {}

  async findNearby(lat: number, lng: number, radiusKm = 5) {
    // Simple proximity search - in production, use PostGIS or similar
    const latRange = radiusKm / 111; // Rough conversion
    const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    return this.prisma.lootBox.findMany({
      where: {
        isActive: true,
        lat: {
          gte: lat - latRange,
          lte: lat + latRange,
        },
        lng: {
          gte: lng - lngRange,
          lte: lng + lngRange,
        },
        hunt: {
          status: 'ACTIVE',
        },
      },
      include: {
        hunt: {
          include: {
            business: true,
          },
        },
      },
    });
  }
}
