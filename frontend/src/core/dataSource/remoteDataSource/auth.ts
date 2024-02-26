import { sendRequest } from "../../helpers/request";

export type LoginData = {
  email: string;
  password: string;
};
export type registerData = {
  email: string;
  fullName: string;
  userType?: string;
  password: string;
};

type User = {
  fullName: string;
  email: string;
  userType: string;
};
type loginResponse = {
  message: string;
  user: User;
  token: string;
};
type registerResponse = {
  message: string;
};

export const productDataSource = {
  login: async (data: LoginData): Promise<loginResponse> => {
    const response = await sendRequest({
      body: data,
      route: "auth/login",
      method: "POST",
    });
    return response;
  },
  register: async (data: registerData): Promise<registerResponse> => {
    const response = await sendRequest({
      body: data,
      route: "auth/register",
      method: "POST",
    });
    return response;
  },
};
