import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HuntsService } from './hunts.service';

@ApiTags('hunts')
@Controller('hunts')
export class HuntsController {
  constructor(private readonly huntsService: HuntsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get all active hunts' })
  async findActiveHunts() {
    return this.huntsService.findActiveHunts();
  }
}
