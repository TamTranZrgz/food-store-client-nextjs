"use client"; // run in 2 envs: build & client

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogined?: boolean;
}[] = [
  {
    title: "Trang chu",
    href: "/", // authRequired = undefined, this menu will appear whenever login or not logined
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogined: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

// if Use local storage to check auth
// Server: Menu, Login . Because server does not know state of client
// Client: first client will display Menu, Login, but after Client will render Menu, Orders and manage because client has checked Local Storage
// => will cause conflict after client is logined, and refresh page
// Text rendered by Client will not match text rendered by Server => hydration error
// Fix this problem: use useEffect to chech state of client (state of local storage)

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

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
    <>
      {menuItems.map((item) => {
        // Case: Only display menu when logined
        const isAuth = item.role && role && item.role.includes(role);

        // Case: Menu item can display not depend on whether logined or not
        const canShow =
          (item.role === undefined && !item.hideWhenLogined) ||
          (!role && item.hideWhenLogined);

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <div className={cn(className, "cursor-pointer")} onClick={logout}>
          Dang xuat
        </div>
      )}
    </>
  );
}
