type AuthFetchOptions = RequestInit & {
  retry?: boolean; // internal flag to prevent infinite retry loops
};

/**
 * Wrapper around fetch
 *  - performs an authenticated fetch that automatically refreshes an expired access token using a refresh token and retries the request once before failing.
 */
export async function authFetch(
  input: RequestInfo, // URL or Request object
  options: AuthFetchOptions, // fetch options (method, headers, body etc.)
  accessToken: string | null, // current in-mmory access token
  setAccessToken: (token: string | null) => void,
): Promise<Response> {
  // 1. Perform the original request
  //    - Attach Authorization header if access token exists
  //    - Always include credentials so cookies (refresh token) are sent
  const res = await fetch(input, {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  // 2. If the request did NOT fail with 401,
  //    or if this request is already a retry,
  //    return the response as-is
  if (res.status !== 401 || options.retry === false) {
    return res;
  }

  // 3. We received a 401 on the first attempt
  //    -> access token is likely expired
  //    -> attempt to refresh it
  const refreshRes = await fetch("http://localhost:3001/auth/refresh", {
    method: "POST",
    credentials: "include", // required to send refresh token cookie
  });

  // 4. If refresh fails:
  //    - session is no longer valid
  //    - clear access token from memory
  //    - propagate failure to caller
  if (!refreshRes.ok) {
    setAccessToken(null);
    throw new Error("Unauthorized");
  }

  // 5. Refresh succeeded -> extract new access token
  const { accessToken: newToken } = await refreshRes.json();

  // 6. Store new access token in memory (AuthContext)
  setAccessToken(newToken);

  // 7. Retry original request ONCE
  //    - attach the new token
  //    - mark retry=false to prevent infinite loops
  return authFetch(
    input,
    { ...options, retry: false },
    newToken,
    setAccessToken,
  );
}
