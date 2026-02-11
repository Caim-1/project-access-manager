"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { getMe } from "@/lib/getMe";
import { redirect } from "next/navigation";

export type UserDTO = {
  id: string;
  email: string;
};

export default function Profile() {
  const { accessToken, setAccessToken, loading } = useAuth();
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    getMe(accessToken, setAccessToken)
      .then(setUser)
      .catch(() => {
        redirect("/login");
      });
  }, [accessToken]);

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setAccessToken(null);
  }

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!accessToken) {
    redirect("/login");
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black ">
            Profile
          </h1>

          <div className="text-gray-700">User ID: {user.id}</div>
          <div className="text-gray-700">Email: {user.email}</div>
          <a href="/notes" className="font-medium text-zinc-950">
            Notes
          </a>
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => logout()}
            type="button"
          >
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}
