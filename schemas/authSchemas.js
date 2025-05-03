import Joi from "joi";
import j2s from "joi-to-swagger";

import { emailRegexp } from "../constants/auth.js";

const exampleEmail = "example@gmail.com";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .pattern(emailRegexp)
    .min(4)
    .max(255)
    .required()
    .example(exampleEmail),
  password: Joi.string().min(6).max(255).required(),
});

export const { swagger: registerSwagger } = j2s(registerSchema);

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .min(4)
    .max(255)
    .required()
    .example(exampleEmail),
  password: Joi.string().max(255).required(),
});

export const { swagger: loginSwagger } = j2s(loginSchema);

const registerResponseSchema = Joi.object({
  data: Joi.object({
    user: Joi.object({
      id: Joi.number().example(1),
      name: Joi.string(),
      email: Joi.string().example(exampleEmail),
    }),
  }),
});

export const { swagger: registerResponseSwagger } = j2s(registerResponseSchema);

const userResponseSchema = Joi.object({
  id: Joi.number().example(1),
  name: Joi.string(),
  email: Joi.string().example(exampleEmail),
  avatarURL: Joi.string().optional(),
});

const loginResponseSchema = Joi.object({
  data: Joi.object({
    token: Joi.string(),
    user: userResponseSchema,
  }),
});

export const { swagger: loginResponseSwagger } = j2s(loginResponseSchema);

const currentResponseSchema = Joi.object({
  data: Joi.object({
    user: userResponseSchema,
  }),
});

export const { swagger: currentResponseSwagger } = j2s(currentResponseSchema);
