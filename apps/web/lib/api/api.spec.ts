import { apiClient } from "./api";

// Mock the fetch API
global.fetch = jest.fn();

describe("ApiClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("request", () => {
    it("makes a fetch request with correct headers", async () => {
      const mockResponse = { ok: true, json: async () => ({ id: "1" }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await (apiClient as any).request("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
      expect(result).toEqual({ id: "1" });
    });

    it("throws error on non-ok response", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({}),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect((apiClient as any).request("/test")).rejects.toThrow(
        "API Error: 404 Not Found",
      );
    });

    it("parses error details from response body", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Invalid input" }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect((apiClient as any).request("/test")).rejects.toThrow(
        "Invalid input",
      );
    });

    it("handles network errors", async () => {
      const networkError = new TypeError("fetch failed");
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect((apiClient as any).request("/test")).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("getTasks", () => {
    it("fetches tasks without filters", async () => {
      const mockTasks = [{ id: "1", title: "Task 1" }];
      const mockResponse = { ok: true, json: async () => mockTasks };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiClient.getTasks();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/tasks"),
        expect.any(Object),
      );
      expect(result).toEqual(mockTasks);
    });

    it("fetches tasks with filters", async () => {
      const mockTasks: any[] = [];
      const mockResponse = { ok: true, json: async () => mockTasks };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await apiClient.getTasks({ status: "pending", priority: "high" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("status=pending"),
        expect.any(Object),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("priority=high"),
        expect.any(Object),
      );
    });
  });

  describe("getTask", () => {
    it("fetches a single task by id", async () => {
      const mockTask = { id: "1", title: "Task 1" };
      const mockResponse = { ok: true, json: async () => mockTask };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiClient.getTask("1");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/tasks/1"),
        expect.any(Object),
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("createTask", () => {
    it("creates a task with POST request", async () => {
      const taskData = {
        title: "New Task",
        status: "pending" as const,
        priority: "low" as const,
      };
      const mockTask = { id: "1", ...taskData };
      const mockResponse = { ok: true, json: async () => mockTask };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiClient.createTask(taskData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/tasks"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(taskData),
        }),
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("updateTask", () => {
    it("updates a task with PUT request", async () => {
      const updateData = { title: "Updated Task" };
      const mockTask = { id: "1", title: "Updated Task" };
      const mockResponse = { ok: true, json: async () => mockTask };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiClient.updateTask("1", updateData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/tasks/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updateData),
        }),
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("deleteTask", () => {
    it("deletes a task with DELETE request", async () => {
      const mockTask = { id: "1", title: "Task 1" };
      const mockResponse = { ok: true, json: async () => mockTask };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiClient.deleteTask("1");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/tasks/1"),
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("getTaskStats", () => {
    it("fetches task statistics", async () => {
      const mockStats = { status: { pending: 5 }, priority: { high: 2 } };
      const mockResponse = { ok: true, json: async () => mockStats };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiClient.getTaskStats();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/tasks/stats"),
        expect.any(Object),
      );
      expect(result).toEqual(mockStats);
    });
  });
});
