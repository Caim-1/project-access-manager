import jwt from "jsonwebtoken";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7D",
  });
}
