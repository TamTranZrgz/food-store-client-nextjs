import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { EntityError } from "./http";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Delete first character `/` of path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

// local storage is only valid when run it on browser/client
const isBrowser = typeof window !== "undefined";

// Get accessToken & refreshToken from localStorage
export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

// set accessToken & refreshToken
export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("accessToken", value);
};

export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("refreshToken", value);
};

export const removeAccessTokenAndRefreshTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  // Keep logic to get accessToken and refreshToken inside this function
  // So everuting time this function is called, it will get new accessToken and refreshToken
  // This prevent bug from get old accessToken and refreshToken from first time, and call for next times
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // if not logined, not run this function
  if (!accessToken || !refreshToken) return;

  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };

  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };

  // time to expire of token calculated by epoch time (s)
  // if using new Date(.getTime()), it will return time in ms
  const now = new Date().getTime() / 1000 - 1;

  // if refreshToken is expired, will not continue, and log out
  // refeshToken expires, tokens from cookies will be deleted, but tokens from LS not, so we need to remove it
  if (decodedRefreshToken.exp <= now) {
    console.log("Refresh token is expired");
    removeAccessTokenAndRefreshTokenFromLocalStorage();
    param?.onError && param.onError();
    return; // return so it will stop here, not go to next line
  }

  // if accessToken is expired within 10s, we will check when there is 3s left and refresh token
  // remaining time = decodedAcessToken.exp - now
  // time to expire of accessToken: decodedAcessToken.exp - decodedAcessToken.iat
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // call api refrshToken
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.data.accessToken);
      setRefreshTokenToLocalStorage(res.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
