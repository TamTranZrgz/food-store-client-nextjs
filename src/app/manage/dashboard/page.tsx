import accountApiRequest from "@/apiRequests/account";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookiesStore = cookies();
  const accessToken = cookiesStore.get("accessToken")?.value as string;
  let name = "";
  try {
    const result = await accountApiRequest.sMe(accessToken);
    // console.log(result);
    name = result.payload.data.name;
  } catch (error: any) {
    // cath this error
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }

  return <div>Dashboard {name}</div>;
}
