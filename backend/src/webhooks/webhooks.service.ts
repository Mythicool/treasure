import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async handleStripeWebhook(event: any) {
    // TODO: Implement Stripe webhook handling
    console.log('Stripe webhook received:', event.type);
    return { received: true };
  }
}
