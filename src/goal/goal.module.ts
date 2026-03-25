import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GoalSchemaClass,
  GoalSchema,
} from './infrastructure/schemas/goal.schema';
import { MongooseGoalRepository } from './infrastructure/goal.repository';
import { GoalService } from './application/goal.service';
import { GoalController } from './presentation/goal.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoalSchemaClass.name, schema: GoalSchema },
    ]),
  ],
  providers: [
    {
      provide: 'GOAL_REPOSITORY',
      useClass: MongooseGoalRepository,
    },
    GoalService,
  ],
  controllers: [GoalController],
  exports: [GoalService],
})
export class GoalModule {}
