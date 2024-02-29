import { ApiManager } from "./axios";

const EditEmailListApi = async (id: any, formData: any) => {
  console.log("formData", formData);
  const token = sessionStorage.getItem("token");
  const response = await ApiManager.put(`/email-lists/${id}`, formData, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response;
};

export default EditEmailListApi;
