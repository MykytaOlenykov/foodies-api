import express from "express";

import { authControllers } from "../controllers/authControllers.js";
import { usersControllers } from "../controllers/usersControllers.js";

export const usersRouter = express.Router();
