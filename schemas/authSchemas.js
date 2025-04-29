import Joi from "joi";
import { emailRegexp } from "../constants/auth.js";

export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).min(4).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).min(4).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
});
