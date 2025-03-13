import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";
import { Task } from "../taskModel";
import { tasks } from "../taskRepository";

describe("Task API Endpoints", () => {
  describe("GET /tasks", () => {
    it("should return a list of tasks", async () => {
      // Act
      const response = await request(app).get("/tasks");
      const responseBody: ServiceResponse<Task[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Tasks found");
      expect(responseBody.responseObject.length).toEqual(tasks.length);
      responseBody.responseObject.forEach((task, index) =>
        compareTask(tasks[index] as Task, task)
      );
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return a task for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const expectedTask = tasks.find((task) => task.id === testId) as Task;

      // Act
      const response = await request(app).get(`/tasks/${testId}`);
      const responseBody: ServiceResponse<Task> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Task found");
      if (!expectedTask)
        throw new Error("Invalid test data: expectedTask is undefined");
      compareTask(expectedTask, responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/tasks/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Task not found");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Act
      const invalidInput = "abc";
      const response = await request(app).get(`/tasks/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareTask(mockTask: Task, responseTask: Task) {
  if (!mockTask || !responseTask) {
    throw new Error("Invalid test data: mockTask or responseTask is undefined");
  }

  expect(responseTask.id).toEqual(mockTask.id);
  expect(responseTask.title).toEqual(mockTask.title);
  expect(responseTask.status).toEqual(mockTask.status);
  expect(new Date(responseTask.createdAt)).toEqual(mockTask.createdAt);
  expect(new Date(responseTask.updatedAt)).toEqual(mockTask.updatedAt);
}
