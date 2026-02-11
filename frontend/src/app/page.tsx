"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useAuth } from "@/auth/useAuth";

export default async function Home() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (accessToken) {
    redirect("/profile");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-20 py-32 px-16 bg-white sm:items-start">
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
      </main>
    </div>
  );
}
