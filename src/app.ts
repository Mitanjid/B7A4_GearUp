import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";

import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { categoryRoutes } from "./modules/categories/category.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
