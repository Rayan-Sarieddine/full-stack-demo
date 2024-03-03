import { sendRequest } from "../../helpers/request";

export type CreateTodoData = {
  title: string;
  description?: string;
  date: Date;
  priorityLevel: PriorityLevel;
  completed: boolean;
  pinned: boolean;
};
export type UpdateTodoData = {
  title?: string;
  description?: string;
  date?: Date;
  priorityLevel?: PriorityLevel;
  completed?: boolean;
  pinned?: boolean;
};
export type PriorityLevel = "TOP" | "MEDIUM" | "LOW";
type Todo = {
  id: number;
  userId: number;
  title: string;
  description?: string;
  date: Date;
  priorityLevel: PriorityLevel;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  pinned: boolean;
};
type GetTodoResponse = Todo[];
type CreateTodoResponse = Todo;
type UpdateTodoResponse = Todo;
type DeleteTodoResponse = Todo;

export const todoDataSource = {
  getTodos: async (): Promise<GetTodoResponse> => {
    const response = await sendRequest({
      route: "todos/",
      method: "GET",
    });
    return response;
  },
  create: async (data: CreateTodoData): Promise<CreateTodoResponse> => {
    const response = await sendRequest({
      body: data,
      route: "todos/",
      method: "POST",
    });
    return response;
  },
  update: async (
    data: UpdateTodoData,
    id: number
  ): Promise<UpdateTodoResponse> => {
    const response = await sendRequest({
      body: data,
      route: `todos/${id}`,
      method: "PUT",
    });
    return response;
  },
  delete: async (id: number): Promise<DeleteTodoResponse> => {
    const response = await sendRequest({
      route: `todos/${id}`,
      method: "DELETE",
    });
    return response;
  },
};
