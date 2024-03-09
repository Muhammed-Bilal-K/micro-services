import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import UserController from "./routes/user";
import "./configdb/db";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.Port || 3001;

app.use("/", UserController);

const start = () => {
  app.listen(PORT, () => {
    console.log(`server has been connected on http://localhost:${PORT}`);
  });
};

start();
