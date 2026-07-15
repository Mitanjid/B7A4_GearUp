import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";

import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { categoryRoutes } from "./modules/categories/category.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalRoutes } from "./modules/rentals/rental.route";
import { paymentRoutes } from "./modules/payments/payment.route";
import { reviewRoutes } from "./modules/reviews/review.route";
import { adminRoutes } from "./modules/admin/admin.route";

const app: Application = express();
app.use(
  cors({
    origin: "*",
    credentials: false,   
  }),

);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/gear", gearRoutes);

app.use("/api/rentals", rentalRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
