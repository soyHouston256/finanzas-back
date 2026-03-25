import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountSchemaClass,
  AccountSchema,
} from './infrastructure/schemas/account.schema';
import { MongooseAccountRepository } from './infrastructure/account.repository';
import { AccountService } from './application/account.service';
import { AccountController } from './presentation/account.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountSchemaClass.name, schema: AccountSchema },
    ]),
  ],
  providers: [
    {
      provide: 'ACCOUNT_REPOSITORY',
      useClass: MongooseAccountRepository,
    },
    AccountService,
  ],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
