import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TransactionService } from '../application/transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() query: QueryTransactionsDto) {
    return this.transactionService.findAll(query);
  }

  @Get('periods')
  findPeriods() {
    return this.transactionService.findAvailablePeriods();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.transactionService.delete(id);
  }
}
