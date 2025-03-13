import type { Request, RequestHandler, Response } from "express";
import { taskService } from "./taskService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class TaskController {
  public getTasks: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await taskService.findAll();
    return handleServiceResponse(serviceResponse, res) as any;
  };

  public getTask: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await taskService.findById(id);
    return handleServiceResponse(serviceResponse, res) as any;
  };
}

export const taskController = new TaskController();
