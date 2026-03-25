import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ITransactionRepository } from '../domain/transaction.repository';
import { Transaction } from '../domain/transaction.entity';
import { CreateTransactionDto } from '../presentation/dto/create-transaction.dto';
import { UpdateTransactionDto } from '../presentation/dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction)
      throw new NotFoundException(`Transaction ${id} not found`);
    return transaction;
  }

  create(dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionRepository.create(dto);
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionRepository.update(id, dto);
    if (!transaction)
      throw new NotFoundException(`Transaction ${id} not found`);
    return transaction;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.transactionRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Transaction ${id} not found`);
  }
}
