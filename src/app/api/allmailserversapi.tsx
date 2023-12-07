import { ApiManager } from "./axios";

export const AllMailServersApi = async (index: any) => {
  const token = sessionStorage.getItem("token");
  const response = await ApiManager.get("/mailservers", {
    headers: {
      Authorization: "Bearer " + token,
    },
    params: {
      index, // Pass the startIndex as a query parameter
    },
  });

  return response;
};
