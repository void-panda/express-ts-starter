import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/userModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { TaskRepository } from "./taskRepository";
import { Task } from "./taskModel";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(repository: TaskRepository = new TaskRepository()) {
    this.taskRepository = repository;
  }

  // Retrieves all tasks from the database
  async findAll(): Promise<ServiceResponse<Task[] | null>> {
    try {
      const tasks = await this.taskRepository.findAllAsync();
      if (!tasks || tasks.length === 0) {
        return ServiceResponse.failure(
          "No Tasks found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Task[]>("Tasks found", tasks);
    } catch (ex) {
      const errorMessage = `Error finding all tasks: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving tasks.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single task by their ID
  async findById(id: number): Promise<ServiceResponse<Task | null>> {
    try {
      const task = await this.taskRepository.findByIdAsync(id);
      if (!task) {
        return ServiceResponse.failure(
          "Task not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Task>("task found", task);
    } catch (ex) {
      const errorMessage = `Error finding task with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding task.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const taskService = new TaskService();
