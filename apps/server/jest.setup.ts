// jest setup for server tests
// mock out the Prisma client so that importing 'generated/prisma/client'
// doesn't attempt to load the real generated code or connect to a database.

// ensure environment variable exists so DatabaseService constructor doesn't throw
process.env.DATABASE_URL ||= 'postgres://localhost:5432/test';

jest.mock('generated/prisma/client', () => {
  class MockPrismaClient {
    task = {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    };
    $connect = jest.fn();
    $disconnect = jest.fn();
  }

  class PrismaClientKnownRequestError extends Error {
    code: string;
    constructor(message?: string, code = 'P2000') {
      super(message);
      this.code = code;
    }
  }

  // minimal enum placeholders – actual values aren't needed for tests
  const TaskStatus = {
    pending: 'pending',
    inProgress: 'inProgress',
    completed: 'completed',
  };
  const TaskPriority = { low: 'low', medium: 'medium', high: 'high' };

  return {
    PrismaClient: MockPrismaClient,
    Prisma: { PrismaClientKnownRequestError },
    TaskStatus,
    TaskPriority,
  };
});
