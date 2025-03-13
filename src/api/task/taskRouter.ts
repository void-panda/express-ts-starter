import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetTaskSchema, TaskSchema } from "@/api/task/taskModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { taskController } from "./taskController";

export const taskRegistry = new OpenAPIRegistry();
export const taskRouter: Router = express.Router();

taskRegistry.register("Task", TaskSchema);

taskRegistry.registerPath({
  method: "get",
  path: "/tasks",
  tags: ["Task"],
  responses: createApiResponse(z.array(TaskSchema), "Success"),
});

taskRouter.get("/", taskController.getTasks);

taskRegistry.registerPath({
  method: "get",
  path: "/tasks/{id}",
  tags: ["Task"],
  request: { params: GetTaskSchema.shape.params },
  responses: createApiResponse(TaskSchema, "Success"),
});
/*@ts-ignore */
taskRouter.get("/:id", validateRequest(GetTaskSchema), taskController.getTask);
