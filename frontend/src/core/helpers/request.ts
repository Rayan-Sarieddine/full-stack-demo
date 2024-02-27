import axios from "axios";
import { local } from "./localStorage";

type requestParams = {
  route: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: unknown;
};

axios.defaults.baseURL = "http://localhost:3002";
export const sendRequest = async ({
  route,
  method = "GET",
  body,
}: requestParams) => {
  const token: string | null | void = local("type");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const response = await axios({ method, url: route, data: body, headers });
  return response.data;
};
