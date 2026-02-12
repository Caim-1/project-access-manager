"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useAuth } from "@/auth/useAuth";

export default function Home() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (accessToken) {
    redirect("/profile");
  }

  return (
    <>
      <Image
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
          To get started, edit the page.tsx file.
        </h1>
        <a href="/login" className="font-medium text-zinc-950">
          Login
        </a>
        <a href="/register" className="font-medium text-zinc-950">
          Register
        </a>
      </div>
    </>
  );
}
