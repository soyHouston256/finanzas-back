import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { ITrackingRepository } from '../domain/tracking.repository';
import { Tracking } from '../domain/tracking.entity';
import {
  TrackingSchemaClass,
  TrackingDocument,
} from './schemas/tracking.schema';

@Injectable()
export class MongooseTrackingRepository implements ITrackingRepository {
  constructor(
    @InjectModel(TrackingSchemaClass.name)
    private readonly trackingModel: Model<TrackingDocument>,
  ) {}

  private toEntity(doc: TrackingDocument): Tracking {
    const plain = {
      _id: doc._id.toString(),
      month: doc.month,
      year: doc.year,
      total_income: doc.total_income,
      total_expenses: doc.total_expenses,
      expected_income: doc.expected_income,
      categories: doc.categories,
    };
    return plainToInstance(Tracking, plain);
  }

  async findAll(): Promise<Tracking[]> {
    const docs = await this.trackingModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<Tracking | null> {
    const doc = await this.trackingModel.findById(id).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(tracking: Partial<Tracking>): Promise<Tracking> {
    const created = new this.trackingModel(tracking);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async update(
    id: string,
    tracking: Partial<Tracking>,
  ): Promise<Tracking | null> {
    const doc = await this.trackingModel
      .findByIdAndUpdate(id, tracking, { new: true })
      .exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.trackingModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
