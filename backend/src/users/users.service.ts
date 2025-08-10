import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        business: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        business: true,
        _count: {
          select: {
            claims: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        business: true,
        _count: {
          select: {
            claims: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        business: true,
      },
    });
  }

  async findByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        business: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        business: true,
      },
    });
  }

  async updateLastSeen(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastSeenAt: new Date() },
    });
  }

  async updateRole(id: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      include: {
        business: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.findById(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserStats(id: string) {
    const user = await this.findById(id);
    
    const [claimsCount, recentClaims] = await Promise.all([
      this.prisma.claim.count({
        where: { userId: id },
      }),
      this.prisma.claim.findMany({
        where: { userId: id },
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
        take: 10,
      }),
    ]);

    return {
      user,
      stats: {
        totalClaims: claimsCount,
        recentClaims,
      },
    };
  }
}
