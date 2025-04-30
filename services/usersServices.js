import { HttpError } from "../helpers/HttpError.js";
import { sequelize, User, Recipe } from "../db/sequelize.js";
import { filesServices } from "./filesServices.js";

const getUserById = async (userId, currentUser) => {
  const isOwnProfile = userId === currentUser.id;

  const privateAttributes = isOwnProfile
    ? [
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("favoriteRecipes.id"))
          ),
          "favoriteRecipesCount",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("following.id"))
          ),
          "followingCount",
        ],
      ]
    : [];

  const privateInclude = isOwnProfile
    ? [
        {
          model: Recipe,
          as: "favoriteRecipes",
          through: { attributes: [] },
          attributes: [],
        },
        {
          model: User,
          as: "following",
          through: { attributes: [] },
          attributes: [],
        },
      ]
    : [];

  const userInstance = await User.findByPk(userId, {
    include: [
      {
        model: Recipe,
        as: "recipes",
        attributes: [],
      },
      {
        model: User,
        as: "followers",
        through: { attributes: [] },
        attributes: [],
      },
      ...privateInclude,
    ],
    attributes: [
      "id",
      "name",
      "email",
      "avatarURL",
      [
        sequelize.fn(
          "COUNT",
          sequelize.fn("DISTINCT", sequelize.col("recipes.id"))
        ),
        "recipesCount",
      ],
      [
        sequelize.fn(
          "COUNT",
          sequelize.fn("DISTINCT", sequelize.col("followers.id"))
        ),
        "followersCount",
      ],
      ...privateAttributes,
    ],
    group: ["User.id"],
  });

  if (!userInstance) throw HttpError(404, "User not found");

  const userJson = userInstance.toJSON();

  return {
    ...userJson,
    recipesCount: Number(userJson.recipesCount),
    followersCount: Number(userJson.followersCount),
    favoriteRecipesCount: userJson.favoriteRecipesCount
      ? Number(userJson.favoriteRecipesCount)
      : undefined,
    followingCount: userJson.followingCount
      ? Number(userJson.followingCount)
      : undefined,
  };
};

const updateUserAvatar = async (userId, file) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const avatarURL = await filesServices.processAvatar(file);

  if (user.avatarURL) {
    await filesServices.removeFile(user.avatarURL);
  }

  await user.update({ avatarURL: avatarURL });

  return user;
};

const getFollowers = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: User,
        as: "followers",
        attributes: ["id", "name", "email", "avatarURL"],
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  return user.followers || [];
};

const getFollowing = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: User,
        as: "following",
        attributes: ["id", "name", "email", "avatarURL"],
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  return user.following || [];
};

export const usersServices = {
  getUserById,
  updateUserAvatar,
  getFollowers,
  getFollowing,
};
