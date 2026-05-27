import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js"
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";


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
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Handle the user profile and authentication logic here
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/prod", productRouter)

export default app;
