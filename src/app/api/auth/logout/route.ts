import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";

// Suppose user can always logout successfully
export async function POST(request: Request) {
  const cookieStore = cookies();

  // Before delete AT & RT in cookies, get their values first to use for logout api later in try/catch
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Not receive access token and refresh token",
      },
      {
        status: 200,
      }
    );
  }

  // call logout api
  try {
    const result = await authApiRequest.sLogout({ accessToken, refreshToken });

    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      {
        message: "Error calling api to server backend",
      },
      {
        status: 200,
      }
    );
  }
}
