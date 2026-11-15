import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TendersController } from './tenders.controller';
import { TendersService } from './tenders.service';
import { Tender, TenderSchema } from './schemas/tenders.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tender.name, schema: TenderSchema }])],
  controllers: [TendersController],
  providers: [TendersService],
  exports: [TendersService],
})
export class TendersModule {}
