import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

export default app;
