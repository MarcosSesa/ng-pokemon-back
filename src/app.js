import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/cards.routes.js";

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.listen(port);