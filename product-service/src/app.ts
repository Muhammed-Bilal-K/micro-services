import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import ProductController from "./routes/product";
import "./configdb/db"; 

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT! || 3002;

app.use("/", ProductController);

const start = () => {
  app.listen(PORT, () => {
    console.log(`products server has been connected on http://localhost:${PORT}`);
  });
};

start();
