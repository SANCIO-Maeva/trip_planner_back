import express from "express";
import dotenv from 'dotenv';
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import TripValidator from "../../validators/TripValidator.js";

dotenv.config();

const router = express.Router();

const prisma = new PrismaClient();

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

const prePrompt = "Tu es un planificateur de voyage, expert en tourisme. Pour la destination, le nombre de jours et le moyen de locomotion que je te donnerai à la fin du message, programme moi un itinéraire en plusieurs étapes Format de données souhaité: une liste d'élement JSON Avec, pour chaque étape: - le nom du lieu (clef JSON: name) -sa position géographique (clef JSON: location-> avec latitude/longitude en numérique) - une courte description (clef JSON: description) Donne-moi juste cette liste d'étape, sans texte aucun texte autour.";



/////////////////////////////////////////
/////////////* Create /trips  *//////////
/////////////////////////////////////////

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const mistralRes = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [{ role: "user", content: prePrompt + " " + prompt }],
        }),
      }
    );

    const mistralData = await mistralRes.json();

    const entry = await prisma.trip.create({
        data: {
         prompt,
         output: JSON.parse(mistralData.choices[0].message.content),
        },
    });

    res.status(200).json(entry);
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
});




/////////////////////////////////////////
/////////////* Read /trips */////////////
/////////////////////////////////////////

router.get("/", async (req, res) => {
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



/////////////////////////////////////////
//////////* Read /trips/:id *////////////
/////////////////////////////////////////

  router.get("/:id", async (req, res, next) => {
    const trip = await prisma.trip.findUnique({
      where: {
        id: String(req.params.id),
      },
    });
  
    if (!trip) {
      return next(createError(404, "Trip not found"));
    }
  
    res.json(trip);
  });


/////////////////////////////////////////
/////////////* Update /trips/:id *///////
/////////////////////////////////////////

  router.patch("/:id", async (req, res) => {
    let trip;
  
    try {
      trip = TripValidator.parse(req.body);
    } catch (error) {
      return res.status(400).json({ errors: error.issues });
    }
    const entry = await prisma.trip.update({
        where:{
            id : String(req.params.id),
        },
      data: {
        prompt: trip.prompt,
        output: trip.output,
        updatedAt: trip.updatedAt,
      },
    });
  
    res.json(entry);
  });
  
  export default router;