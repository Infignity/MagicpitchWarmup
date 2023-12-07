import { ApiManager } from "./axios";

export const DeleteMailServerApi = async (data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.post('/mailservers/delete', data,  {
        headers:{
            'Authorization': 'Bearer ' + token 
        }
    });
    return response;
}