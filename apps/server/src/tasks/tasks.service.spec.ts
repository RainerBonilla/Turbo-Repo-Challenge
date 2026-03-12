import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatabaseService } from '../database/database.service';

describe('TasksService', () => {
  let service: TasksService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        groupBy: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: DatabaseService,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('passes validated data to database and converts dates', async () => {
      const input = {
        title: 'Test',
        description: 'desc',
        dueDate: '2025-01-01',
        status: 'pending',
        priority: 'low',
      } as any;
      const expected = { id: '1', ...input };
      mockDb.task.create.mockResolvedValue(expected);

      const result = await service.create(input);
      expect(mockDb.task.create).toHaveBeenCalled();
      const callArg = mockDb.task.create.mock.calls[0][0];
      expect(callArg.data.title).toBe('Test');
      expect(callArg.data.dueDate).toBeInstanceOf(Date);
      expect(result).toEqual(expected);
    });

    it('throws if invalid data provided', async () => {
      await expect(service.create({ title: '' } as any)).rejects.toBeDefined();
    });
  });

  describe('findAll', () => {
    it('returns tasks without filters', async () => {
      const tasks = [{ id: '1' }];
      mockDb.task.findMany.mockResolvedValue(tasks);
      const result = await service.findAll({});
      expect(mockDb.task.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: {},
      });
      expect(result).toEqual(tasks);
    });

    it('applies filters and sort', async () => {
      const tasks = [{ id: '2' }];
      mockDb.task.findMany.mockResolvedValue(tasks);
      const result = await service.findAll({
        status: 'pending',
        sortBy: 'dueDate' as any,
      });
      expect(mockDb.task.findMany).toHaveBeenCalledWith({
        where: { status: 'pending' },
        orderBy: { dueDate: 'desc' },
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('returns a task when found', async () => {
      const task = { id: 'abc' };
      mockDb.task.findUnique.mockResolvedValue(task);
      expect(await service.findOne('abc')).toEqual(task);
    });

    it('returns null when not found', async () => {
      mockDb.task.findUnique.mockResolvedValue(null);
      expect(await service.findOne('missing')).toBeNull();
    });
  });

  describe('update', () => {
    it('updates and converts dates', async () => {
      const update = { title: 'New', dueDate: '2024-12-12' };
      const returned = { id: '1', ...update };
      mockDb.task.update.mockResolvedValue(returned);
      const res = await service.update('1', update as any);
      expect(mockDb.task.update).toHaveBeenCalled();
      const callArg = mockDb.task.update.mock.calls[0][0];
      expect(callArg.data.updatedAt).toBeInstanceOf(Date);
      expect(res).toEqual(returned);
    });

    it('throws on invalid update data', async () => {
      await expect(
        service.update('1', { status: 'not-a-status' } as any),
      ).rejects.toBeDefined();
    });
  });

  describe('remove', () => {
    it('deletes a task by id', async () => {
      const deleted = { id: 'x' };
      mockDb.task.delete.mockResolvedValue(deleted);
      expect(await service.remove('x')).toEqual(deleted);
      expect(mockDb.task.delete).toHaveBeenCalledWith({ where: { id: 'x' } });
    });
  });

  describe('getStats', () => {
    it('aggregates status and priority counts', async () => {
      mockDb.task.groupBy.mockResolvedValue([
        { status: 'pending', priority: 'high', _count: { _all: 2 } },
        { status: 'pending', priority: 'low', _count: { _all: 1 } },
      ]);
      const stats = await service.getStats();
      expect(stats.status.pending).toBe(3);
      expect(stats.priority.high).toBe(2);
      expect(stats.priority.low).toBe(1);
    });
  });
});
