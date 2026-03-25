import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITrackingRepository } from '../domain/tracking.repository';
import { Tracking } from '../domain/tracking.entity';
import { CreateTrackingDto } from '../presentation/dto/create-tracking.dto';
import { UpdateTrackingDto } from '../presentation/dto/update-tracking.dto';

@Injectable()
export class TrackingService {
  constructor(
    @Inject('TRACKING_REPOSITORY')
    private readonly trackingRepository: ITrackingRepository,
  ) {}

  findAll(): Promise<Tracking[]> {
    return this.trackingRepository.findAll();
  }

  async findById(id: string): Promise<Tracking> {
    const tracking = await this.trackingRepository.findById(id);
    if (!tracking) throw new NotFoundException(`Tracking ${id} not found`);
    return tracking;
  }

  create(dto: CreateTrackingDto): Promise<Tracking> {
    return this.trackingRepository.create(dto);
  }

  async update(id: string, dto: UpdateTrackingDto): Promise<Tracking> {
    const tracking = await this.trackingRepository.update(id, dto);
    if (!tracking) throw new NotFoundException(`Tracking ${id} not found`);
    return tracking;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.trackingRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Tracking ${id} not found`);
  }
}
