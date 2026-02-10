"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { getMe } from "../lib/getMe";
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

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!accessToken) {
    redirect("/login");
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>User ID: {user.id}</div>
      <div>Email: {user.email}</div>
    </div>
  );
}
