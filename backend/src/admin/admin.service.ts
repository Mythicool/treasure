import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [userCount, businessCount, huntCount, claimCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.business.count(),
      this.prisma.hunt.count(),
      this.prisma.claim.count(),
    ]);

    return {
      users: userCount,
      businesses: businessCount,
      hunts: huntCount,
      claims: claimCount,
    };
  }
}
