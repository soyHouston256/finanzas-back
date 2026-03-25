import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IGoalRepository } from '../domain/goal.repository';
import { Goal } from '../domain/goal.entity';
import { CreateGoalDto } from '../presentation/dto/create-goal.dto';
import { UpdateGoalDto } from '../presentation/dto/update-goal.dto';

@Injectable()
export class GoalService {
  constructor(
    @Inject('GOAL_REPOSITORY')
    private readonly goalRepository: IGoalRepository,
  ) {}

  findAll(): Promise<Goal[]> {
    return this.goalRepository.findAll();
  }

  async findById(id: string): Promise<Goal> {
    const goal = await this.goalRepository.findById(id);
    if (!goal) throw new NotFoundException(`Goal ${id} not found`);
    return goal;
  }

  create(dto: CreateGoalDto): Promise<Goal> {
    return this.goalRepository.create(dto);
  }

  async update(id: string, dto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.goalRepository.update(id, dto);
    if (!goal) throw new NotFoundException(`Goal ${id} not found`);
    return goal;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.goalRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Goal ${id} not found`);
  }
}
