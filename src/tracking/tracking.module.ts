import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TrackingSchemaClass,
  TrackingSchema,
} from './infrastructure/schemas/tracking.schema';
import { MongooseTrackingRepository } from './infrastructure/tracking.repository';
import { TrackingService } from './application/tracking.service';
import { TrackingController } from './presentation/tracking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackingSchemaClass.name, schema: TrackingSchema },
    ]),
  ],
  providers: [
    {
      provide: 'TRACKING_REPOSITORY',
      useClass: MongooseTrackingRepository,
    },
    TrackingService,
  ],
  controllers: [TrackingController],
  exports: [TrackingService],
})
export class TrackingModule {}
