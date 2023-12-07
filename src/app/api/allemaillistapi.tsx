import { ApiManager } from "./axios";

export const AllEmailListApi = async (data : any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.get(`/email-lists`, {
        headers:{
            Authorization: 'Bearer ' + token 
        },
        params: {
            listType : data
        }
    });
    
   
    return response;
}