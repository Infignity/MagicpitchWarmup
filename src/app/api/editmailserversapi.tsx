import { ApiManager } from "./axios";

export const EditMailServersApi = async (id:any,data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.put(`/mailservers/${id}`, data,  {
        headers:{
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}