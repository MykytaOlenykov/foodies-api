import { verifySecret, hashSecret } from "../helpers/hashing.js";
import { HttpError } from "../helpers/HttpError.js";
import { jwt } from "../helpers/jwt.js";
import { sequelize, User, Recipe } from "../db/sequelize.js";

const registerUser = async (body) => {
  const { name, email, password } = body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await hashSecret(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  return { id: newUser.id, name: newUser.name, email: newUser.email };
};

const loginUser = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await verifySecret(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload);

  user.token = token;
  await user.save();

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
  };
};

const getUserById = async (id, user) => {
  const userId = Number(id);

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

  const userInfo = await User.findByPk(userId, {
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

  if (!userInfo) throw HttpError(404, "User not found");

  const userJson = userInfo.toJSON();

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
  registerUser,
  loginUser,
  getUserById,
};
