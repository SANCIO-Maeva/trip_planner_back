import express from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";

import TripValidator from "../../validators/TripValidator.js";

const router = express.Router();

const prisma = new PrismaClient();


////////////// Create /trips  //////////////

router.post("/", async (req, res) => {
  let trip;

  try {
    trip = TripValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }
  const entry = await prisma.trip.create({
    data: {
      prompt: trip.prompt,
      output: trip.output,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    },
  });

  res.json(entry);
});

export default router;
