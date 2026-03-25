import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { ITransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
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

  async findAll(): Promise<Transaction[]> {
    const docs = await this.transactionModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
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
