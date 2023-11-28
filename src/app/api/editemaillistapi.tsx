import { ApiManager } from "./axios";

const EditEmailListApi = async (id: any, data: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.put(`/email-lists/${id}`, data,  {
        headers:{
            'Authorization': 'Bearer ' + token 
        }
    });
   
    return response;
}

export default EditEmailListApi;