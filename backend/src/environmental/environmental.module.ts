import { Module } from '@nestjs/common';
import { EnvironmentalService } from './environmental.service';
import { EnvironmentalController } from './environmental.controller';

@Module({
  providers: [EnvironmentalService],
  controllers: [EnvironmentalController],
})
export class EnvironmentalModule {}
