import { Router } from "express";
import { areasControllers } from "../controllers/areasControllers.js";

const areasRouter = Router();

areasRouter.get("/", areasControllers.getAllAreas);

export { areasRouter };