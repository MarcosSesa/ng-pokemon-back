import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const userRoutes = express.Router();
const prisma = new PrismaClient();

// Return an array of the logged user cards for a given expansion
userRoutes.post("/cards", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const setId = req.body.setId;
    const userWithCards = prisma.user.findUnique({
      where: { id: userId },
      select: {
        cards: {
          where: { setId: setId },
        },
      },
    });
    if (!userWithCards) {
      return res
        .status(404)
        .json({ message: "User or Expansion ID Not Found" });
    }
    res.json(userWithCards.cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a card to the logged user collection for a given expansion
userRoutes.post("/cards/add", authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { setId, cardId } = req.body;

    const newCard = prisma.cards.create({
      data: {
        id: cardId,
        userId: userId,
        setId: setId,
      },
    });
    res
      .status(200)
      .json({ message: "Cards added to your collection successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRoutes;