import { Task } from "./taskModel";

export const tasks: Task[] = [
  {
    id: 1,
    title: "Give Alice a gift",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: 2,
    title: "Reading a Book",
    status: "finished",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: 1,
    title: "Learn Backend",
    status: "on-going",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
];

export class TaskRepository {
  async findAllAsync(): Promise<Task[]> {
    return tasks;
  }

  async findByIdAsync(id: number): Promise<Task | null> {
    return tasks.find((user) => user.id === id) || null;
  }
}
