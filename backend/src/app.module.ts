import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { HuntsModule } from './hunts/hunts.module';
import { LootBoxesModule } from './loot-boxes/loot-boxes.module';
import { ClaimsModule } from './claims/claims.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
      limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    }]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    HuntsModule,
    LootBoxesModule,
    ClaimsModule,
    WebhooksModule,
    AdminModule,
  ],
})
export class AppModule {}
