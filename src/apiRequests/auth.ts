import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  // Login
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),

  login: (body: LoginBodyType) =>
    http.post<LoginResType>("api/auth/login", body, {
      baseUrl: "",
    }),

  // Logout
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        // next server can not get access token from inheritance, so need to pass it in header
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  logout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }), // client call to Route Handler, not need to pass access token and refresh token because becaus they are sent automatically through cookies

  // Refresh token
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body),

  refreshToken: () =>
    http.post<RefreshTokenResType>("/api/auth/refresh-token", null, {
      baseUrl: "",
    }),
};

export default authApiRequest;
