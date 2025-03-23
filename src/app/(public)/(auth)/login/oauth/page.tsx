"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/components/app-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSetTokensToCookiesMutation } from "@/queries/useAuth";

export default function OauthPage() {
  const { mutateAsync } = useSetTokensToCookiesMutation();
  const router = useRouter();
  const count = useRef(0);
  const { setRole, setSocket } = useAppContext();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(generateSocketInstance(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({
              description: e.message || "Something went wrong",
            });
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            description: message || "Something went wrong",
          });
        });
      }
      count.current++;
    }
  }, [accessToken, refreshToken, setRole, router, setSocket, message]);
  return <div />;
}
