import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IAccountRepository } from '../domain/account.repository';
import { Account } from '../domain/account.entity';
import { AccountSchemaClass, AccountDocument } from './schemas/account.schema';

@Injectable()
export class MongooseAccountRepository implements IAccountRepository {
  constructor(
    @InjectModel(AccountSchemaClass.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  private toEntity(doc: AccountDocument): Account {
    const plain = {
      _id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      currency: doc.currency,
      balance: doc.balance,
      credit_limit: doc.credit_limit,
    };
    return plainToInstance(Account, plain);
  }

  async findAll(): Promise<Account[]> {
    const docs = await this.accountModel.find().exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<Account | null> {
    const doc = await this.accountModel.findById(id).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async create(account: Partial<Account>): Promise<Account> {
    const created = new this.accountModel(account);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async update(id: string, account: Partial<Account>): Promise<Account | null> {
    const doc = await this.accountModel
      .findByIdAndUpdate(id, account, { new: true })
      .exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.accountModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
