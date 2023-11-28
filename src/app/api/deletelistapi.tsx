import { ApiManager } from "./axios";

export const DeleteListApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post('/email-lists/delete', data,  {
        headers:{
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}