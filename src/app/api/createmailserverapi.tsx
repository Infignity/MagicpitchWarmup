import { ApiManager } from "./axios";

export const CreateMailServerApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post("/mailservers", data, {
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}