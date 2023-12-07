import axios from "axios";

export const ApiManager = axios.create({
  baseURL: "https://api-warmup.infignity.uk/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
