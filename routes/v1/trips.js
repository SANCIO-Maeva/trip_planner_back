import express from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";

import TripValidator from "../../validators/TripValidator.js";

const router = express.Router();

const prisma = new PrismaClient();



/////////////////////////////////////////
////////////// Create /trips  ///////////
/////////////////////////////////////////

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



/////////////////////////////////////////
////////////// Read /trips //////////////
/////////////////////////////////////////

router.get("/trips", async (req, res) => {
    // asc ou desc
    const sortOrderQuery = req.query.sortOrder;
    const sortByQuery = req.query.sortBy;
  
    // tri
    let orderBy = [];
    if (sortOrderQuery) {
      orderBy.push({
        [sortByQuery]: sortOrderQuery,
      });
    } 
    
    const trips = await prisma.trip.findMany({
      orderBy,
    });
  
    res.json(trips);
  });