import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Prisma } from 'generated/prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('returns result from service', async () => {
      const dto = { title: 'a' } as any;
      const created = { id: '1' };
      (service.create as jest.Mock).mockResolvedValue(created);
      expect(await controller.create(dto)).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('translates ZodError to BadRequestException', async () => {
      const error = new (require('zod').ZodError)([]);
      (service.create as jest.Mock).mockRejectedValue(error);
      await expect(controller.create({} as any)).rejects.toThrow(
        'Invalid input data',
      );
    });
  });

  describe('getStats', () => {
    it('returns stats from service', async () => {
      const stats = { status: {}, priority: {} };
      (service.getStats as jest.Mock).mockResolvedValue(stats);
      expect(await controller.getStats()).toEqual(stats);
    });
  });

  describe('findAll', () => {
    it('forwards query params', async () => {
      const result = [{ id: 'x' }];
      (service.findAll as jest.Mock).mockResolvedValue(result);
      expect(
        await controller.findAll(
          'pending' as any,
          'high' as any,
          'bob',
          'dueDate',
        ),
      ).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({
        status: 'pending',
        priority: 'high',
        assignee: 'bob',
        sortBy: 'dueDate',
      });
    });
  });

  describe('findOne', () => {
    it('returns task if found', async () => {
      const t = { id: '1' };
      (service.findOne as jest.Mock).mockResolvedValue(t);
      expect(await controller.findOne('1')).toEqual(t);
    });

    it('throws NotFoundException when service returns null', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(null);
      await expect(controller.findOne('missing')).rejects.toThrow(
        'Task not found',
      );
    });
  });

  describe('update', () => {
    it('returns updated task', async () => {
      const updated = { id: '1' };
      (service.update as jest.Mock).mockResolvedValue(updated);
      expect(await controller.update('1', { title: 'x' } as any)).toEqual(
        updated,
      );
    });

    it('converts ZodError to BadRequestException', async () => {
      const error = new (require('zod').ZodError)([]);
      (service.update as jest.Mock).mockRejectedValue(error);
      await expect(controller.update('1', {} as any)).rejects.toThrow(
        'Invalid input data',
      );
    });

    it('wraps unexpected errors (including NotFound) with generic failure', async () => {
      const notFound = new (require('@nestjs/common').NotFoundException)(
        'Task not found',
      );
      (service.update as jest.Mock).mockRejectedValue(notFound);
      await expect(controller.update('1', {} as any)).rejects.toThrow(
        'Failed to update task',
      );
    });

    it('converts Prisma client not-found error', async () => {
      // constructor has complex types; cast to any to avoid TS complaints
      const prismaError = new (Prisma.PrismaClientKnownRequestError as any)(
        'err',
        'P2025',
      );
      (service.update as jest.Mock).mockRejectedValue(prismaError);
      await expect(controller.update('1', {} as any)).rejects.toThrow(
        'Task not found',
      );
    });
  });

  describe('remove', () => {
    it('returns deleted task', async () => {
      const d = { id: '1' };
      (service.remove as jest.Mock).mockResolvedValue(d);
      expect(await controller.remove('1')).toEqual(d);
    });

    it('converts service Prisma error to NotFoundException', async () => {
      const prismaError = new (Prisma.PrismaClientKnownRequestError as any)(
        'err',
        'P2025',
        '',
      );
      (service.remove as jest.Mock).mockRejectedValue(prismaError);
      await expect(controller.remove('1')).rejects.toThrow('Task not found');
    });
  });
});
