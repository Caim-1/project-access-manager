/**
 * Automatic Token Refresh
 *
 * Used to obtain a new access token when the current one expires
 */
export async function refreshToken() {
  const res = await fetch("http://localhost:3001/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.accessToken;
}
