import { ApiManager } from "./axios";

export const AllWarmupServersApi = async (index? : any, name?:any , state?: any) => {
    const token = sessionStorage.getItem("token");
    const response = await ApiManager.get("/warmups", {
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token 
        },
        params: {
            index, // Pass the startIndex as a query parameter
            name,
            state, // Pass the state as a query parameter

        },
    });
   
    return response;
}