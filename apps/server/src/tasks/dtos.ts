import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project setup',
  })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Set up the initial project structure and dependencies',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Task status',
    enum: ['pending', 'inProgress', 'completed'],
    example: 'pending',
  })
  status: 'pending' | 'inProgress' | 'completed';

  @ApiProperty({
    description: 'Task priority',
    enum: ['low', 'medium', 'high'],
    example: 'high',
  })
  priority: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Task due date',
    type: String,
    format: 'date-time',
    example: '2026-03-15T10:00:00Z',
    required: false,
    nullable: true,
  })
  dueDate?: string | null;

  @ApiProperty({
    description: 'Assignee name',
    example: 'John Doe',
    required: false,
    nullable: true,
  })
  assignee?: string | null;
}

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project setup',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Set up the initial project structure and dependencies',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Task status',
    enum: ['pending', 'inProgress', 'completed'],
    example: 'inProgress',
    required: false,
  })
  status?: 'pending' | 'inProgress' | 'completed';

  @ApiProperty({
    description: 'Task priority',
    enum: ['low', 'medium', 'high'],
    example: 'high',
    required: false,
  })
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Task due date',
    type: String,
    format: 'date-time',
    example: '2026-03-15T10:00:00Z',
    required: false,
    nullable: true,
  })
  dueDate?: string | null;

  @ApiProperty({
    description: 'Assignee name',
    example: 'John Doe',
    required: false,
    nullable: true,
  })
  assignee?: string | null;
}

export class TaskResponseDto {
  @ApiProperty({
    description: 'Task ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project setup',
  })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Set up the initial project structure and dependencies',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Task status',
    enum: ['pending', 'inProgress', 'completed'],
    example: 'pending',
  })
  status: 'pending' | 'inProgress' | 'completed';

  @ApiProperty({
    description: 'Task priority',
    enum: ['low', 'medium', 'high'],
    example: 'high',
  })
  priority: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Task due date',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  dueDate: string | null;

  @ApiProperty({
    description: 'Assignee name',
    nullable: true,
  })
  assignee: string | null;

  @ApiProperty({
    description: 'Task creation timestamp',
    type: String,
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Task last update timestamp',
    type: String,
    format: 'date-time',
  })
  updatedAt: string;
}

export class TaskStatsDto {
  @ApiProperty({
    description: 'Task count by status',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      pending: 5,
      'in-progress': 3,
      completed: 12,
    },
  })
  status: Record<string, number>;

  @ApiProperty({
    description: 'Task count by priority',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      low: 8,
      medium: 7,
      high: 5,
    },
  })
  priority: Record<string, number>;
}
