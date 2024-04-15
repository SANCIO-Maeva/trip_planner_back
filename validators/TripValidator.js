import { z } from "zod";

const TripValidator = z.object({
    prompt: z.string(),
    output: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
});

export default TripValidator;
