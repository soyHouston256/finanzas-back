import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { ITransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
import { TransactionPage, TransactionPeriod } from '../domain/transaction-page';
import {
  TransactionSchemaClass,
  TransactionDocument,
} from './schemas/transaction.schema';

@Injectable()
export class MongooseTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionSchemaClass.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  private toEntity(doc: TransactionDocument): Transaction {
    const plain = {
      _id: doc._id.toString(),
      date: doc.date,
      amount: doc.amount,
      category_slug: doc.category_slug,
      subcategory_slug: doc.subcategory_slug,
      account_id: doc.account_id,
      description: doc.description,
    };
    return plainToInstance(Transaction, plain);
  }

  private buildDateFilter(month?: number, year?: number) {
    if (!month || !year) return {};
    const monthString = String(month).padStart(2, '0');
    return {
      date: {
        $gte: `${year}-${monthString}-01`,
        $lte: `${year}-${monthString}-31`,
      },
    };
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    month?: number;
    year?: number;
  }): Promise<TransactionPage> {
    const page = Math.max(params?.page ?? 1, 1);
    const limit = Math.min(Math.max(params?.limit ?? 50, 1), 100);
    const filter = this.buildDateFilter(params?.month, params?.year);

    const [docs, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .sort({ date: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(filter).exec(),
    ]);

    return {
      items: docs.map((doc) => this.toEntity(doc)),
      page,
      limit,
      total,
      hasMore: page * limit < total,
    };
  }

  async findAvailablePeriods(): Promise<TransactionPeriod[]> {
    const docs = (await this.transactionModel
      .aggregate([
        {
          $match: {
            date: { $type: 'string', $regex: /^\d{4}-\d{2}-\d{2}$/ },
          },
        },
        {
          $project: {
            year: { $toInt: { $substrBytes: ['$date', 0, 4] } },
            month: { $toInt: { $substrBytes: ['$date', 5, 2] } },
          },
        },
        {
          $group: {
            _id: {
              year: '$year',
              month: '$month',
            },
          },
        },
        {
          $sort: {
            '_id.year': -1,
            '_id.month': -1,
          },
        },
      ])
      .exec()) as Array<{ _id: { year: number; month: number } }>;

    return docs.map((doc) => ({
      key: `${doc._id.year}-${String(doc._id.month).padStart(2, '0')}`,
      year: doc._id.year,
      month: doc._id.month,
    }));
  }

  async findById(id: string): Promise<Transaction | null> {
    const doc = await this.transactionModel.findById(id).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const created = new this.transactionModel(transaction);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction | null> {
    const doc = await this.transactionModel
      .findByIdAndUpdate(id, transaction, { new: true })
      .exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
