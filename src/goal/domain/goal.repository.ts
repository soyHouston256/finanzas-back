import { Goal } from './goal.entity';

export interface IGoalRepository {
  findAll(): Promise<Goal[]>;
  findById(id: string): Promise<Goal | null>;
  create(goal: Partial<Goal>): Promise<Goal>;
  update(id: string, goal: Partial<Goal>): Promise<Goal | null>;
  delete(id: string): Promise<boolean>;
}
