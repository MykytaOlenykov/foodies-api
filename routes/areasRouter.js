import { Router } from "express";
import { areasControllers } from "../controllers/areasControllers.js";
import { validateQueryString } from "../middlewares/validateQueryString.js";
import { paginationSchema } from "../schemas/commonSchemas.js";

const areasRouter = Router();

areasRouter.get(
  "/",
  validateQueryString(paginationSchema),
  areasControllers.getAllAreas
);

export { areasRouter };
