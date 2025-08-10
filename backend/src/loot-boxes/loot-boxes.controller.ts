import { Controller, Get, Query, ParseFloatPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LootBoxesService } from './loot-boxes.service';

@ApiTags('loot-boxes')
@Controller('loot-boxes')
export class LootBoxesController {
  constructor(private readonly lootBoxesService: LootBoxesService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Find loot boxes near a location' })
  @ApiQuery({ name: 'lat', type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', type: Number, description: 'Longitude' })
  @ApiQuery({ name: 'radius', type: Number, required: false, description: 'Search radius in km' })
  async findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', new ParseFloatPipe({ optional: true })) radius = 5,
  ) {
    return this.lootBoxesService.findNearby(lat, lng, radius);
  }
}
