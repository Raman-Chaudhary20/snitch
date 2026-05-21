import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import cors from "cors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use("/api/auth", authRouter);

export default app;
