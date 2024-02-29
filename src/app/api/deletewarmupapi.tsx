import { ApiManager } from "./axios";

export const DeleteWarmupApi = async (id: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post("/warmups/delete" , id, {
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}