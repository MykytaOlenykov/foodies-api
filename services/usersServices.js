import { Op } from "sequelize";

import { HttpError } from "../helpers/HttpError.js";
import { getOffset } from "../helpers/getOffset.js";
import { sequelize, User, Recipe, UserFollower } from "../db/sequelize.js";
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
  if (!file) {
    throw HttpError(400, "No file uploaded");
  }

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

const getFollowers = async (userId, query) => {
  const { page = 1, limit = 10 } = query;

  const [followers, total] = await Promise.all([
    User.findAll({
      attributes: ["id", "name", "email", "avatarURL"],
      include: [
        {
          model: User,
          as: "following",
          attributes: [],
          where: { id: userId },
        },
        {
          model: Recipe,
          as: "recipes",
          foreignKey: "ownerId",
          attributes: ["id", "thumb"],
          limit: 4,
        },
      ],
      order: [["id", "DESC"]],
      offset: getOffset(page, limit),
      limit,
      group: [
        "User.id",
        "following->UserFollower.userId",
        "following->UserFollower.followerId",
      ],
      subQuery: false,
    }),
    UserFollower.count({ where: { userId } }),
  ]);

  const recipes = await Recipe.findAll({
    where: {
      ownerId: { [Op.in]: followers.map(({ id }) => id) },
    },
    attributes: ["ownerId", [getCountFuncByColumn("id"), "recipesCount"]],
    group: ["ownerId"],
    raw: true,
  });

  return {
    total,
    followers: followers.map((follower) => {
      const followerJSON = follower.toJSON();
      const recipesCount = recipes.find(
        ({ ownerId }) => ownerId === followerJSON.id
      )?.recipesCount;

      return {
        ...followerJSON,
        recipesCount: recipesCount ? Number(recipesCount) : 0,
      };
    }),
  };
};

const getFollowing = async (userId, query) => {
  const { page = 1, limit = 10 } = query;

  const [following, total] = await Promise.all([
    User.findAll({
      attributes: ["id", "name", "email", "avatarURL"],
      include: [
        {
          model: User,
          as: "followers",
          attributes: [],
          where: { id: userId },
        },
        {
          model: Recipe,
          as: "recipes",
          foreignKey: "ownerId",
          attributes: ["id", "thumb"],
          limit: 4,
        },
      ],
      order: [["id", "DESC"]],
      offset: getOffset(page, limit),
      limit,
      group: [
        "User.id",
        "followers->UserFollower.userId",
        "followers->UserFollower.followerId",
      ],
      subQuery: false,
    }),
    UserFollower.count({ where: { followerId: userId } }),
  ]);

  const recipes = await Recipe.findAll({
    where: {
      ownerId: { [Op.in]: following.map(({ id }) => id) },
    },
    attributes: ["ownerId", [getCountFuncByColumn("id"), "recipesCount"]],
    group: ["ownerId"],
    raw: true,
  });

  return {
    following: following.map((user) => {
      const followingJSON = user.toJSON();
      const recipesCount = recipes.find(
        ({ ownerId }) => ownerId === followingJSON.id
      )?.recipesCount;

      return {
        ...followingJSON,
        recipesCount: recipesCount ? Number(recipesCount) : 0,
      };
    }),
    total,
  };
};

const followUser = async (userId, followId) => {
  if (userId === followId) {
    throw HttpError(400, "You can't follow yourself");
  }

  const [user, followUser] = await Promise.all([
    User.findByPk(userId),
    User.findByPk(followId),
  ]);

  if (!user || !followUser) {
    throw HttpError(404, "User not found");
  }

  await user.addFollowing(followUser);
};

const unFollowUser = async (userId, followId) => {
  if (userId === followId) {
    throw HttpError(400, "You can't unfollow yourself");
  }

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
