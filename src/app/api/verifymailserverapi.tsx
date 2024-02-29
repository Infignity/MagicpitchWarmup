import { ApiManager } from "./axios";

export const VerifyMailServerApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post("/mailservers/verify", data, {
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}