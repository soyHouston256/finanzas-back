import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<TransactionSchemaClass>;

@Schema({ timestamps: true, collection: 'transactions' })
export class TransactionSchemaClass {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category_slug: string;

  @Prop({ required: true })
  subcategory_slug: string;

  @Prop({ required: true })
  account_id: string;

  @Prop({ required: true })
  description: string;
}

export const TransactionSchema = SchemaFactory.createForClass(
  TransactionSchemaClass,
);
