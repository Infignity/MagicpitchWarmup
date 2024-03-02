import { ApiManager } from "./axios";

export const GetAnnouncementApi = async () => {
  const response = await ApiManager.get("/announcements");

  return response;
};
