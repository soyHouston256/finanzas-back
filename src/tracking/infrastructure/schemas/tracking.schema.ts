import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrackingDocument = HydratedDocument<TrackingSchemaClass>;

@Schema({ timestamps: true, collection: 'budget_tracking' })
export class TrackingSchemaClass {
  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, default: 0 })
  total_income: number;

  @Prop({ required: true, default: 0 })
  total_expenses: number;

  @Prop({ required: true, default: 0 })
  expected_income: number;

  @Prop({ type: Object, default: {} })
  categories: Record<
    string,
    { budgeted: number; spent: number; remaining: number; pct_used: number }
  >;
}

export const TrackingSchema = SchemaFactory.createForClass(TrackingSchemaClass);
