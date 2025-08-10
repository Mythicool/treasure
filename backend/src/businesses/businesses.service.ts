import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement business management methods
  async findAll() {
    return this.prisma.business.findMany({
      include: {
        user: true,
        hunts: true,
      },
    });
  }
}
