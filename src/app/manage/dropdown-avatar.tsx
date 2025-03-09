"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useLogoutMutation } from "@/queries/useAuth";
import { handleErrorApi } from "@/lib/utils";
import { useAccountMe } from "@/queries/useAccount";
import { useAppContext } from "@/components/app-provider";

const account = {
  name: "Nguyễn Văn A",
  avatar: "https://i.pravatar.cc/150",
};

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const { setRole } = useAppContext();

  // use custome hook to get profile
  const { data } = useAccountMe();
  const account = data?.payload.data;

  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      // after calling logout api, not need to delete AT & RF from Local Storage
      // because they have been deleted in `request` constant in 'http.ts' file
      await logoutMutation.mutateAsync();
      setRole(); // reset role state from AppContext

      // after logout successfully, navigate to home page
      router.push("/");
    } catch (error: any) {
      handleErrorApi({
        error, // not use setError because not use react-hook-form
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={account?.avatar ?? undefined}
              alt={account?.name}
            />
            <AvatarFallback>
              {account?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
