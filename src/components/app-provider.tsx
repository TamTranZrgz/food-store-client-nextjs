"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeAccessTokenAndRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import type { Socket } from "socket.io-client";
import ListenLogoutSocket from "@/components/listen-logout-socket";
import { create } from "zustand";

// Default
// staleTime: 0 // time to refetch
// gc: 5 minutes ( 5 * 1000 * 60) // time that data is deleted after not used

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// const AppContext = createContext({
//   isAuth: false,
//   role: undefined as RoleType | undefined, // not login
//   setRole: (role?: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket?: Socket | undefined) => {},
//   disconnectSocket: () => {},
// });

type AppStoreType = {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
};

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) });
    if (!role) {
      removeAccessTokenAndRefreshTokenFromLocalStorage();
    }
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect();
      return { socket: undefined };
    }),
}));

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [socket, setSocket] = useState<Socket | undefined>();
  // const [role, setRoleState] = useState<RoleType | undefined>();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);

  const count = useRef(0);

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRole(role);
        setSocket(generateSocketInstance(accessToken));
      }
    }
    count.current++;
  }, [setRole, setSocket]);

  // const disconnectSocket = useCallback(() => {
  //   socket?.disconnect();
  //   setSocket(undefined);
  // }, [socket, setSocket]);

  // If us nextjs 15 and react 19, will no need to useCallback
  // const setRole = useCallback((role?: RoleType | undefined) => {
  //   setRoleState(role);
  //   if (!role) {
  //     removeAccessTokenAndRefreshTokenFromLocalStorage();
  //   }
  // }, []);

  // const isAuth = Boolean(role);

  // If we use React 19 and Nextjs 15, will not need AppContext.Provider, only need AppContext
  return (
    // <AppContext.Provider
    //   value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}
    // >
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // </AppContext.Provider>
  );
}
