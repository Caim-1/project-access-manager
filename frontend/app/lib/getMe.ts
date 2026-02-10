import { authFetch } from "./authFetch";

export async function getMe(
  accessToken: string | null,
  setAccessToken: (token: string | null) => void,
) {
  // 1. Call the protected /users/me endpoint
  //    - authFetch will:
  //      - attach Authorization header
  //      - refresh token on 401
  //      - retry automatically
  const res = await authFetch(
    "http://localhost:3001/users/me",
    { method: "GET" },
    accessToken,
    setAccessToken,
  );

  // 2. If the request still failed after refresh,
  //    the user is unauthenticated or forbidden
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}
