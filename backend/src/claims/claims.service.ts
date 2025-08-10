import { 
  Injectable, 
  BadRequestException, 
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimDto } from './dto/claim.dto';
import { ClaimMethod } from '@prisma/client';

@Injectable()
export class ClaimsService {
  constructor(private prisma: PrismaService) {}

  async createClaim(userId: string, createClaimDto: CreateClaimDto) {
    const { lootBoxId, lat, lng, accuracy, deviceId, ipAddress, userAgent } = createClaimDto;

    // Get loot box with hunt details
    const lootBox = await this.prisma.lootBox.findUnique({
      where: { id: lootBoxId },
      include: {
        hunt: true,
        claims: {
          where: { userId },
        },
      },
    });

    if (!lootBox) {
      throw new NotFoundException('Loot box not found');
    }

    // Check if user already claimed this loot box
    if (lootBox.claims.length > 0) {
      throw new BadRequestException('You have already claimed this loot box');
    }

    // Check if loot box is active
    if (!lootBox.isActive) {
      throw new BadRequestException('This loot box is no longer active');
    }

    // Check if hunt is active
    const now = new Date();
    if (lootBox.hunt.startAt && lootBox.hunt.startAt > now) {
      throw new BadRequestException('Hunt has not started yet');
    }
    if (lootBox.hunt.endAt && lootBox.hunt.endAt < now) {
      throw new BadRequestException('Hunt has ended');
    }

    // Check if loot box has reached max claims
    if (lootBox.claimsCount >= lootBox.maxClaims) {
      throw new BadRequestException('This loot box has reached maximum claims');
    }

    // Verify GPS proximity (if not in test mode)
    if (process.env.MOCK_GPS_VERIFICATION !== 'true') {
      const distance = this.calculateDistance(
        parseFloat(lootBox.lat.toString()),
        parseFloat(lootBox.lng.toString()),
        lat,
        lng
      );

      if (distance > lootBox.radiusMeters) {
        throw new ForbiddenException('You are not close enough to claim this loot box');
      }
    }

    // Check velocity limit (anti-spoofing)
    await this.checkVelocityLimit(userId);

    // Generate reward code
    const rewardCode = this.generateRewardCode();

    // Create claim in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the claim
      const claim = await tx.claim.create({
        data: {
          userId,
          lootBoxId,
          method: ClaimMethod.GPS,
          claimLat: lat,
          claimLng: lng,
          accuracy,
          deviceId,
          ipAddress,
          userAgent,
          rewardCode,
        },
        include: {
          lootBox: {
            include: {
              hunt: {
                include: {
                  business: true,
                },
              },
            },
          },
          user: true,
        },
      });

      // Update loot box claims count
      await tx.lootBox.update({
        where: { id: lootBoxId },
        data: {
          claimsCount: {
            increment: 1,
          },
        },
      });

      // Update hunt claims count
      await tx.hunt.update({
        where: { id: lootBox.huntId },
        data: {
          claimsCount: {
            increment: 1,
          },
        },
      });

      // Update or create leaderboard entry
      await tx.leaderboard.upsert({
        where: {
          userId_huntId: {
            userId,
            huntId: lootBox.huntId,
          },
        },
        update: {
          score: {
            increment: 10, // Base score for claim
          },
          claimsCount: {
            increment: 1,
          },
          lastClaimAt: new Date(),
        },
        create: {
          userId,
          huntId: lootBox.huntId,
          score: 10,
          claimsCount: 1,
          lastClaimAt: new Date(),
        },
      });

      return claim;
    });

    return result;
  }

  async findUserClaims(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [claims, total] = await Promise.all([
      this.prisma.claim.findMany({
        where: { userId },
        include: {
          lootBox: {
            include: {
              hunt: {
                include: {
                  business: true,
                },
              },
            },
          },
        },
        orderBy: { claimedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.claim.count({
        where: { userId },
      }),
    ]);

    return {
      claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async redeemClaim(claimId: string, userId: string) {
    const claim = await this.prisma.claim.findFirst({
      where: {
        id: claimId,
        userId,
      },
      include: {
        lootBox: {
          include: {
            hunt: {
              include: {
                business: true,
              },
            },
          },
        },
      },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    if (claim.isRedeemed) {
      throw new BadRequestException('Claim has already been redeemed');
    }

    return this.prisma.claim.update({
      where: { id: claimId },
      data: {
        isRedeemed: true,
        redeemedAt: new Date(),
      },
      include: {
        lootBox: {
          include: {
            hunt: {
              include: {
                business: true,
              },
            },
          },
        },
      },
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  private async checkVelocityLimit(userId: string) {
    const velocityLimitSeconds = parseInt(process.env.CLAIM_VELOCITY_LIMIT_SECONDS) || 60;
    const cutoffTime = new Date(Date.now() - velocityLimitSeconds * 1000);

    const recentClaim = await this.prisma.claim.findFirst({
      where: {
        userId,
        claimedAt: {
          gte: cutoffTime,
        },
      },
      orderBy: { claimedAt: 'desc' },
    });

    if (recentClaim) {
      throw new ForbiddenException(
        `You must wait ${velocityLimitSeconds} seconds between claims`
      );
    }
  }

  private generateRewardCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
