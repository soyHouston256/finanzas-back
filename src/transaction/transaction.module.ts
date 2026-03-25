import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionSchemaClass,
  TransactionSchema,
} from './infrastructure/schemas/transaction.schema';
import { MongooseTransactionRepository } from './infrastructure/transaction.repository';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './presentation/transaction.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionSchemaClass.name, schema: TransactionSchema },
    ]),
  ],
  providers: [
    {
      provide: 'TRANSACTION_REPOSITORY',
      useClass: MongooseTransactionRepository,
    },
    TransactionService,
  ],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
