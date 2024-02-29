import { ApiManager } from "./axios";

export const AllEmailListApi = async (listType: any, index?:any , name?:any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.get(`/email-lists`, {
        headers:{
            Authorization: 'Bearer ' + token 
        },
        params: {
            listType,
            index,
            name
        }
    });
    
   
    return response;
}