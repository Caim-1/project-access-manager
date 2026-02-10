import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/routes.js";
import userRoutes from "./routes/user/routes.js";
import noteRoutes from "./routes/notes.routes.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

export default app;
