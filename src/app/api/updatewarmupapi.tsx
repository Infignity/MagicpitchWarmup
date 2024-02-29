import { ApiManager } from "./axios";

export const UpdateWarmupApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post("/warmups/update-state", data, {
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}
