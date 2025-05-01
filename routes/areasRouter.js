import { Router } from "express";
import { areasControllers } from "../controllers/areasControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { getAllAreasQueryStringSchema } from "../schemas/areasSchemas.js";

const areasRouter = Router();

areasRouter.get(
  "/",
  validateQueryString(getAllAreasQueryStringSchema),
  areasControllers.getAllAreas
);

export { areasRouter };
