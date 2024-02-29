import { ApiManager } from "./axios";

export const SignUpApi = async (data: any) => {
    const response = await ApiManager.post("/users", data);
    return response;
}
