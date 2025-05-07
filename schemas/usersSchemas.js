import Joi from "joi";
import j2s from "joi-to-swagger";

export const getUserByIdSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

const getUserByIdResponseSchema = Joi.object({
  data: Joi.object({
    user: Joi.object({
      id: Joi.number().example(1),
      name: Joi.string(),
      email: Joi.string().example("example@gmail.com"),
      avatarURL: Joi.string(),
      recipesCount: Joi.number(),
      followersCount: Joi.number(),
      favoriteRecipesCount: Joi.number().optional(),
      followingCount: Joi.number().optional(),
      isFollowed: Joi.boolean().optional(),
    }),
  }),
});

export const { swagger: getUserByIdResponseSwagger } = j2s(
  getUserByIdResponseSchema
);

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

const userResponseSchema = Joi.object({
  id: Joi.number().example(1),
  name: Joi.string(),
  avatarURL: Joi.string(),
  recipes: Joi.array().items(
    Joi.object({
      id: Joi.number().example(1),
      thumb: Joi.string().uri(),
    })
  ),
  recipesCount: Joi.number(),
});

const gatFollowersResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    followers: Joi.array().items(userResponseSchema),
  }),
});

export const { swagger: gatFollowersResponseSwagger } = j2s(
  gatFollowersResponseSchema
);

const gatFollowingResponseSchema = Joi.object({
  data: Joi.object({
    total: Joi.number().example(10),
    following: Joi.array().items(userResponseSchema),
  }),
});

export const { swagger: gatFollowingResponseSwagger } = j2s(
  gatFollowingResponseSchema
);

const followToUserResponseSchema = Joi.object({
  data: Joi.object({
    message: Joi.string(),
  }),
});

export const { swagger: followToUserResponseSwagger } = j2s(
  followToUserResponseSchema
);
