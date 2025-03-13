import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Task = z.infer<typeof TaskSchema>;
export const TaskSchema = z.object({
	id: z.number(),
	title: z.string(),
	status: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetTaskSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
