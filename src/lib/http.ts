import envConfig from "@/config";
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeAccessTokenAndRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "HTTP error",
  }: {
    status: number;
    payload: { [key: string]: unknown; message: string };
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Entity error" });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<unknown> = null;
const isClient = typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  // If not pass baseUrl (or baseUrl = undefined), get from envConfig.NEXT_PUBLIC_API_ENDPOINT
  // If pass baseUrl, get that value.  Passing '' calling API to Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  // Interceptor is where we resolve request/response before return it to component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null, // Logout will be always successful
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
            console.error(error);
          } finally {
            removeAccessTokenAndRefreshTokenFromLocalStorage();
            clientLogoutRequest = null;

            // Redirect to Login page can cause loop indefinitely if not deal correctly
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = "/login"; // comment this code when you want to debug
          }
        }
      } else {
        // Đây là trường hợp khi mà chúng ta vẫn còn access token (còn hạn)
        // Và chúng ta gọi API ở Next.js Server (Route Handler , Server Component) đến Server Backend
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];

        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError({
        status: res.status,
        payload: data.payload as { [key: string]: unknown; message: string },
      });
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (["api/auth/login", "api/guest/auth/login"].includes(normalizeUrl)) {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      setAccessTokenToLocalStorage(accessToken);
      setRefreshTokenToLocalStorage(refreshToken);
    } else if ("api/auth/token" === normalizeUrl) {
      const { accessToken, refreshToken } = payload as {
        accessToken: string;
        refreshToken: string;
      };
      setAccessTokenToLocalStorage(accessToken);
      setRefreshTokenToLocalStorage(refreshToken);
    } else if (
      ["api/auth/logout", "api/guest/auth/logout"].includes(normalizeUrl)
    ) {
      removeAccessTokenAndRefreshTokenFromLocalStorage();
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
