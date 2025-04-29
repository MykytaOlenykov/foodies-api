import { HttpError } from "../helpers/HttpError.js";
import { sequelize, User, Recipe } from "../db/sequelize.js";

const getUserById = async (userId, user) => {
  const privateAttributes =
    userId === user.id
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

  const privateInclude =
    userId === user.id
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

export const usersServices = {
  getUserById,
};
