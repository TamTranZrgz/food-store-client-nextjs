import envConfig from "@/config";
import { io } from "socket.io-client";
import { getAccessTokenFromLocalStorage } from "./utils";

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
  },
  autoConnect: false, // socket will only connect when login successfully, not when entering the web
});

export default socket;
