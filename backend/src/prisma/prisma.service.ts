import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }

  async cleanDb() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Delete in reverse order of dependencies
    await this.claim.deleteMany();
    await this.lootBox.deleteMany();
    await this.hunt.deleteMany();
    await this.transaction.deleteMany();
    await this.business.deleteMany();
    await this.auditLog.deleteMany();
    await this.leaderboard.deleteMany();
    await this.user.deleteMany();
  }
}
