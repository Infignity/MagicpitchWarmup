import { ApiManager } from "./axios";

export const CreateListApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post("/email-lists", data, {
        headers:{
            "Content-Type": "multipart/form-data",
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}