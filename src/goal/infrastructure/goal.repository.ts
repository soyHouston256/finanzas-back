import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IGoalRepository } from '../domain/goal.repository';
import { Goal } from '../domain/goal.entity';
import { GoalSchemaClass, GoalDocument } from './schemas/goal.schema';

@Injectable()
export class MongooseGoalRepository implements IGoalRepository {
  constructor(
    @InjectModel(GoalSchemaClass.name)
    private readonly goalModel: Model<GoalDocument>,
  ) {}

  private toEntity(doc: GoalDocument): Goal {
    const plain = {
      _id: doc._id.toString(),
      name: doc.name,
      target: doc.target,
      current: doc.current,
      date: doc.date,
      payment: doc.payment,
      installment: doc.installment,
    };
    return plainToInstance(Goal, plain);
  }

  async findAll(): Promise<Goal[]> {
    const docs = await this.goalModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<Goal | null> {
    const doc = await this.goalModel.findById(id).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(goal: Partial<Goal>): Promise<Goal> {
    const created = new this.goalModel(goal);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async update(id: string, goal: Partial<Goal>): Promise<Goal | null> {
    const doc = await this.goalModel
      .findByIdAndUpdate(id, goal, { new: true })
      .exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.goalModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
