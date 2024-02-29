import { ApiManager } from "./axios";

export const CreateWarmupApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post("/warmups", data, {
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}