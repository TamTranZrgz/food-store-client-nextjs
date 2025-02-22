"use client"; // run in 2 envs: build & client

import { useAppContext } from "@/components/app-provider";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired = undefined, this menu will appear whenever login or not logined
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true, // Dashboard page will display when logined
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Login page will display when NOT logined
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Dashboard page will display when logined
  },
];

// if Use local storage to check auth
// Server: Menu, Login . Because server does not know state of client
// Client: first client will display Menu, Login, but after Client will render Menu, Orders and manage because client has checked Local Storage
// => will cause conflict after client is logined, and refresh page
// Text rendered by Client will not match text rendered by Server => hydration error
// Fix this problem: use useEffect to chech state of client (state of local storage)

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
