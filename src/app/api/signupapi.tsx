import { ApiManager } from "./axios";

export const SignUpApi = async (data: any) => {
  const response = await ApiManager.post("/users", data);
  return response;
};

export const GetUserApi = async () => {
  const response = await ApiManager.get("/users");
  return response;
};
