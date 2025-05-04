import Joi from "joi";
import j2s from "joi-to-swagger";

export const getUserByIdSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

export const getFollowersParamsSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

export const followUserParamsSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

export const unFollowUserParamsSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

const updateAvatarResponseSchema = Joi.object({
  data: Joi.object({
    avatarURL: Joi.string(),
  }),
});

export const { swagger: updateAvatarResponseSwagger } = j2s(
  updateAvatarResponseSchema
);
