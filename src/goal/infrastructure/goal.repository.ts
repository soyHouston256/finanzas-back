import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  private toEntity(doc: Record<string, unknown>): Goal {
    const raw = doc;
    const target =
      Number(raw.target ?? raw.target_amount ?? raw.targetAmount ?? 0) || 0;
    const current =
      Number(raw.current ?? raw.current_amount ?? raw.currentAmount ?? 0) || 0;
    const name = String(raw.name ?? 'Meta');
    const date = String(raw.date ?? raw.target_date ?? raw.targetDate ?? '');
    const payment = Number(raw.payment ?? 0) || 0;
    const installment = String(raw.installment ?? '');

    const idValue = raw._id as Types.ObjectId | string | undefined;
    const plain = {
      _id: idValue ? String(idValue) : '',
      name,
      target,
      current,
      date,
      payment,
      installment,
    };
    return plainToInstance(Goal, plain);
  }

  async findAll(): Promise<Goal[]> {
    const docs = (await this.goalModel.find().lean().exec()) as unknown as Array<
      Record<string, unknown>
    >;
    return docs
      .filter((doc) => !doc._init)
      .map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<Goal | null> {
    const doc = (await this.goalModel
      .findById(id)
      .lean()
      .exec()) as unknown as Record<string, unknown> | null;
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(goal: Partial<Goal>): Promise<Goal> {
    const created = new this.goalModel(goal);
    const saved = await created.save();
    return this.toEntity(saved.toObject() as unknown as Record<string, unknown>);
  }

  async update(id: string, goal: Partial<Goal>): Promise<Goal | null> {
    const doc = await this.goalModel
      .findByIdAndUpdate(id, goal, { new: true })
      .exec();
    if (!doc) return null;
    return this.toEntity(doc.toObject() as unknown as Record<string, unknown>);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.goalModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
