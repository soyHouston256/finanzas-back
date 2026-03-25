import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<AccountSchemaClass>;

@Schema({ timestamps: true, collection: 'accounts' })
export class AccountSchemaClass {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['bank', 'credit_card', 'cash'] })
  type: 'bank' | 'credit_card' | 'cash';

  @Prop({ required: true, enum: ['PEN', 'USD'] })
  currency: 'PEN' | 'USD';

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ type: Number, default: null })
  credit_limit: number | null;
}

export const AccountSchema = SchemaFactory.createForClass(AccountSchemaClass);
