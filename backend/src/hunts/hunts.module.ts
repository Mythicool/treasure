import { Module } from '@nestjs/common';
import { HuntsService } from './hunts.service';
import { HuntsController } from './hunts.controller';

@Module({
  providers: [HuntsService],
  controllers: [HuntsController],
  exports: [HuntsService],
})
export class HuntsModule {}
