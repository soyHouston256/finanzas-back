import { Tracking } from './tracking.entity';

export interface ITrackingRepository {
  findAll(): Promise<Tracking[]>;
  findById(id: string): Promise<Tracking | null>;
  create(tracking: Partial<Tracking>): Promise<Tracking>;
  update(id: string, tracking: Partial<Tracking>): Promise<Tracking | null>;
  delete(id: string): Promise<boolean>;
}
