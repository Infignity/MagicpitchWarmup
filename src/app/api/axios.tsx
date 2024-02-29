import axios from "axios";
import { API_BASE } from "../constants";

export const ApiManager = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
