import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  async handleStripe(@Body() body: any) {
    return this.webhooksService.handleStripeWebhook(body);
  }
}
