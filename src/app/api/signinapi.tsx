import { ApiManager } from "./axios";

export const SignInApi = async (data: any) => {
    const response = await ApiManager.post("/auth/token", data, {
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });
   
    return response;
}