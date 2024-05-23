import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middleware/auth.js";
import { userRegistrationSchema } from "../schemas/user.schema.js";

const authRoutes = express.Router();
const prisma = new PrismaClient();

authRoutes.post("/register", async (req, res) => {
  try {
    const parsedData = userRegistrationSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(parsedData.password, 6);
    const newUser = await prisma.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);

    res
      .status(201)
      .json({ message: "User registered successfully", token: token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed when cresting the new user",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

authRoutes.post("/login", authenticateUser, async (req, res) => {
  const token = jwt.sign({ user: req["user"] }, process.env.TOKEN_SECRET);
  res.status(200).json({ message: "Login successful", token: token });
});

export default authRoutes;