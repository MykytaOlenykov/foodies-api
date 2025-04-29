import { verifySecret, hashSecret } from "../helpers/hashing.js";
import { HttpError } from "../helpers/HttpError.js";
import { jwt } from "../helpers/jwt.js";
import { User } from "../db/models/users.js";
import { sequelize } from "../db/sequelize.js";
import { Recipe } from "../db/models/recipes.js";
import { UserFavoriteRecipe } from "../db/models/userFavoriteRecipes.js";
import { UserFollower } from "../db/models/userFollowers.js";

const registerUser = async (req) => {
  const { name, email, password } = req.body;

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

  return newUser;
};

const loginUser = async (req) => {
  const { email, password } = req.body;

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
    email,
  };

  const token = jwt.sign(payload);

  user.token = token;
  await user.save();

  return {
    token,
    user,
  };
};

const getUserDetailInfo = async (req) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "avatarURL"],
  });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const createdRecipesCount = await Recipe.count({
    where: { ownerId: user.id },
  });

  const favoriteRecipesCount = await UserFavoriteRecipe.count({
    where: { userId: id },
  });

  const followersCount = await UserFollower.count({
    where: { userId: user.id },
  });

  const followingCount = await UserFollower.count({
    where: { followerId: id },
  });

  return {
    email,
    name,
    avatarURL,
    createdRecipesCount,
    favoriteRecipesCount,
    followersCount,
    followingCount,
  };
};

export const usersServices = {
  registerUser,
  loginUser,
  getUserDetailInfo,
};
