import { sendRequest } from "../../helpers/request";

export type CreateTodoData = {
  email: string;
  password: string;
};
export type UpdateTodoData = {
  email: string;
  fullName: string;
  userType?: string;
  password: string;
};
export type DeleteTodoData = {
  newPassword: string;
  token: string | null;
};

export type forgetData = {
  email: string;
};
export type googleData = {
  token: string;
};
export type PriorityLevel = "TOP" | "MEDIUM" | "AVERAGE";
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

export const authDataSource = {
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
  update: async (data: UpdateTodoData): Promise<UpdateTodoResponse> => {
    const response = await sendRequest({
      body: data,
      route: "todos/",
      method: "PUT",
    });
    return response;
  },
  delete: async (data: DeleteTodoData): Promise<DeleteTodoResponse> => {
    const response = await sendRequest({
      body: data,
      route: "todos/",
      method: "DELETE",
    });
    return response;
  },
};
