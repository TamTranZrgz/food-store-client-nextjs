import http from "@/lib/http";
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

const guestApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,

  // Login
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/guest/auth/login", body),

  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),

  // Logout
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/guest/auth/logout",
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
    http.post("/api/guest/auth/logout", null, {
      baseUrl: "",
    }), // client call to Route Handler, not need to pass access token and refresh token because becaus they are sent automatically through cookies

  // Refresh token
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/guest/auth/refresh-token", body),

  async refreshToken(): Promise<RefreshTokenResType> {
    if (this.refreshTokenRequest) this.refreshTokenRequest;

    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );

    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return {
      message: result.payload.message,
      data: result.payload.data,
    };
  },
};

export default guestApiRequest;
