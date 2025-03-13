import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import { Task } from "../taskModel";
import { TaskService } from "../taskService";
import { TaskRepository } from "../taskRepository";

vi.mock("@/api/task/taskRepository");

describe("taskService", () => {
  let taskServiceInstance: TaskService;
  let taskRepositoryInstance: TaskRepository;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: "Give Alice some gift.",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "Learn Backend",
      status: "on-going",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    taskRepositoryInstance = new TaskRepository();
    taskServiceInstance = new TaskService(taskRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all tasks", async () => {
      // Arrange
      (taskRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockTasks);

      // Act
      const result = await taskServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("tasks found");
      expect(result.responseObject).toEqual(mockTasks);
    });

    it("returns a not found error for no tasks found", async () => {
      // Arrange
      (taskRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await taskServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No tasks found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (taskRepositoryInstance.findAllAsync as Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const result = await taskServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals(
        "An error occurred while retrieving tasks."
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a task for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mocktask = mockTasks.find((task) => task.id === testId);
      (taskRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mocktask);

      // Act
      const result = await taskServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("task found");
      expect(result.responseObject).toEqual(mocktask);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (taskRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const result = await taskServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding task.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 1;
      (taskRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await taskServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("task not found");
      expect(result.responseObject).toBeNull();
    });
  });
});
