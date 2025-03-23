import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { useAppContext } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";

// Pages which will not check refresh-token
const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPending, mutateAsync } = useLogoutMutation();
  const { setRole, socket, disconnectSocket } = useAppContext();

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;

    async function onLogout() {
      // console.log("logout");
      if (isPending) return;
      try {
        await mutateAsync();
        setRole(); // reset role state from AppContext
        disconnectSocket();

        // after logout successfully, navigate to home page
        router.push("/");
      } catch (error: any) {
        handleErrorApi({
          error, // not use setError because not use react-hook-form
        });
      }
    }

    socket?.on("logout", onLogout);

    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    socket,
    pathname,
    isPending,
    disconnectSocket,
    mutateAsync,
    setRole,
    router,
  ]);
  return null;
}
