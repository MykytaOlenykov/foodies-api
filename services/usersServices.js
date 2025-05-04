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

const getUserConnections = async (type, userId, query) => {
  const { page = 1, limit = 10 } = query;

  const isFollowers = type === "followers";
  const includeAlias = isFollowers ? "following" : "followers";
  const countWhere = isFollowers ? { userId } : { followerId: userId };

  const [users, total] = await Promise.all([
    User.findAll({
      attributes: ["id", "name", "avatarURL"],
      include: [
        {
          model: User,
          as: includeAlias,
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
        `${includeAlias}->UserFollower.userId`,
        `${includeAlias}->UserFollower.followerId`,
      ],
      subQuery: false,
    }),
    UserFollower.count({ where: countWhere }),
  ]);

  const recipes = await Recipe.findAll({
    where: {
      ownerId: { [Op.in]: users.map(({ id }) => id) },
    },
    attributes: ["ownerId", [getCountFuncByColumn("id"), "recipesCount"]],
    group: ["ownerId"],
    raw: true,
  });

  const key = isFollowers ? "followers" : "following";

  return {
    [key]: users.map((user) => {
      const userJSON = user.toJSON();
      const recipesCount = recipes.find(
        ({ ownerId }) => ownerId === userJSON.id
      )?.recipesCount;

      return {
        ...userJSON,
        recipesCount: recipesCount ? Number(recipesCount) : 0,
      };
    }),
    total,
  };
};

const getFollowers = async (userId, query) => {
  return await getUserConnections("followers", userId, query);
};

const getFollowing = async (userId, query) => {
  return await getUserConnections("following", userId, query);
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
