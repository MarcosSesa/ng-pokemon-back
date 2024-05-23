import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { userLoginSchema } from "../schemas/user.schema.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const authenticateUser = async (req, res, next) => {
  try {
    const parsedData = userLoginSchema.parse(req.body);
    const userToCheck = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });
    const isPasswordValid = await bcrypt.compare(
      parsedData.password,
      userToCheck.password,
    );
    if (!userToCheck || !isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password ",
      });
    }
    req.user = userToCheck;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed when logging in, missing data",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};