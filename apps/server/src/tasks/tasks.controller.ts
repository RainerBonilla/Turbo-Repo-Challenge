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
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ZodError } from 'zod';
import { z } from 'zod';
import { TasksService } from './tasks.service';
import { Prisma, TaskPriority, TaskStatus } from 'generated/prisma/client';
import { TaskSortBy, TaskStats } from '@repo/schemas';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  TaskStatsDto,
} from './dtos';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Get task statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: TaskStatsDto,
  })
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
  @ApiOperation({
    summary: 'Get all tasks with optional filtering and sorting',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'in-progress', 'completed'],
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['low', 'medium', 'high'],
    description: 'Filter by task priority',
  })
  @ApiQuery({
    name: 'assignee',
    required: false,
    type: String,
    description: 'Filter by assignee name',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['dueDate', 'priority', 'createdAt'],
    description: 'Sort results by field',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    type: [TaskResponseDto],
  })
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
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
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
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
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
