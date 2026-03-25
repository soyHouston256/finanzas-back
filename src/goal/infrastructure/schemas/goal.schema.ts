import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoalDocument = HydratedDocument<GoalSchemaClass>;

@Schema({ timestamps: true, collection: 'goals' })
export class GoalSchemaClass {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  target: number;

  @Prop({ required: true, default: 0 })
  current: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: 0 })
  payment: number;

  @Prop({ required: true })
  installment: string;
}

export const GoalSchema = SchemaFactory.createForClass(GoalSchemaClass);
