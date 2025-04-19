import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign in to GoodFill · GoodFill",
  description: "GoodFill is where you can fill your stomach with love",
};

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
