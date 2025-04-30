import { HttpError } from "../helpers/HttpError.js";
import { sequelize, User, Recipe } from "../db/sequelize.js";
import { filesServices } from "./filesServices.js";

const getCountFuncByColumn = (col) => {
  return sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col(col)));
};

const getUserById = async (userId, currentUser) => {
  const isOwnProfile = userId === currentUser.id;

  const privateAttributes = isOwnProfile
    ? [
        [getCountFuncByColumn("favoriteRecipes.id"), "favoriteRecipesCount"],
        [getCountFuncByColumn("following.id"), "followingCount"],
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
      [getCountFuncByColumn("recipes.id"), "recipesCount"],
      [getCountFuncByColumn("followers.id"), "followersCount"],
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
        include: [
          {
            model: Recipe,
            as: "recipes",
            foreignKey: "ownerId",
            attributes: ["id", "thumb"],
            limit: 4,
          },
        ],
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
        include: [
          {
            model: Recipe,
            as: "recipes",
            foreignKey: "ownerId",
            attributes: ["id", "thumb"],
            limit: 4,
          },
        ],
      },
    ],
  });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  return user.following || [];
};

const followUser = async (userId, followId) => {
  const [user, followUser] = await Promise.all([
    User.findByPk(userId),
    User.findByPk(followId),
  ]);

  if (!followUser) {
    throw HttpError(404, "User not found");
  }

  await user.addFollowing(followUser);
};

const unFollowUser = async (userId, followId) => {
  const [user, unFollowUser] = await Promise.all([
    User.findByPk(userId),
    User.findByPk(followId),
  ]);

  if (!user || !unFollowUser) {
    throw HttpError(404, "User not found");
  }

  await user.removeFollowing(unFollowUser);
};

export const usersServices = {
  getUserById,
  updateUserAvatar,
  getFollowers,
  getFollowing,
  followUser,
  unFollowUser,
};
