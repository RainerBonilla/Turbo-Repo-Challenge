import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { z } from 'zod';
import { TasksService } from './tasks.service';
import { Prisma, TaskPriority, TaskStatus } from 'generated/prisma/client';
import { TaskSortBy } from '@repo/schemas';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: Prisma.TaskCreateInput) {
    try {
      return await this.tasksService.create(createTaskDto);
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof ZodError) {
        throw new BadRequestException('Invalid input data: ' + error.message);
      }
      throw new HttpException(
        'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/stats')
  async getStats() {
    try {
      return await this.tasksService.getStats();
    } catch (error) {
      console.error('Error retrieving task statistics:', error);
      throw new HttpException(
        'Failed to retrieve task statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('assignee') assignee?: string,
    @Query('sortBy') sortBy?: z.infer<typeof TaskSortBy>,
  ) {
    try {
      return await this.tasksService.findAll({
        status: status,
        priority: priority,
        assignee,
        sortBy,
      });
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      throw new HttpException(
        'Failed to retrieve tasks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.tasksService.findOne(id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: Prisma.TaskUpdateInput,
  ) {
    try {
      return await this.tasksService.update(id, updateTaskDto);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException('Invalid input data: ' + error.message);
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Task not found');
        }
      }
      throw new HttpException(
        'Failed to update task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.tasksService.remove(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Task not found');
        }
      }
      throw new HttpException(
        'Failed to delete task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
