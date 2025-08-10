import { Module } from '@nestjs/common';
import { LootBoxesService } from './loot-boxes.service';
import { LootBoxesController } from './loot-boxes.controller';

@Module({
  providers: [LootBoxesService],
  controllers: [LootBoxesController],
  exports: [LootBoxesService],
})
export class LootBoxesModule {}
