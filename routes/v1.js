import express from "express";

import TripRouter from "./v1/trips.js";

const router = express.Router();

router.use("/trips", TripRouter);

export default router;
