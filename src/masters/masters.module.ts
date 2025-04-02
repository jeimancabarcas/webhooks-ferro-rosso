import { Module } from '@nestjs/common';
import { MastersService } from './services/masters.service';
import { MastersController } from './controllers/masters.controller';

@Module({
  controllers: [MastersController],
  providers: [MastersService],
})
export class MastersModule {}
