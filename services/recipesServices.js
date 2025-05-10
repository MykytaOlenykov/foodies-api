import {
  sequelize,
  UserFavoriteRecipe,
  User,
  Recipe,
  Area,
  Category,
  Ingredient,
  RecipeIngredient,
} from "../db/sequelize.js";
import { getOffset } from "../helpers/getOffset.js";
import { HttpError } from "../helpers/HttpError.js";
import { filesServices } from "./filesServices.js";

/**
 * Gets a list of recipes with filtering, sorting and pagination.
 * Can sort by popularity if `popular: true` flag is passed.
 *
 * @param {Object} options - Query parameters
 * @param {number} [options.categoryId] - Recipe category ID
 * @param {string} [options.ingredientId] - Ingredient name to filter
 * @param {number} [options.areaId] - Origin region ID
 * @param {number} [options.ownerId] - Origin user ID
 * @param {number} [options.page=1] - Page number for pagination
 * @param {number} [options.limit=10] - Number of recipes per page
 * @param {string} [options.sort] - Sort by, such as 'title_ASC' or 'time_DESC'
 * @param {boolean} [options.popular=false] - If true, sort by number of fans
 *
 * @returns {Object} Result with array of recipes, number of pages, and current page
 */
const getRecipes = async (
  { categoryId, areaId, ingredientId, ownerId, page = 1, limit = 10 },
  user = null
) => {
  const where = {};
  const include = [
    { model: User, as: "owner", attributes: ["id", "name", "avatarURL"] },
  ];

  if (areaId) where.areaId = areaId;
  if (categoryId) where.categoryId = categoryId;
  if (ownerId) where.ownerId = ownerId;

  if (ingredientId) {
    include.push({
      model: Ingredient,
      as: "ingredients",
      where: { id: ingredientId },
      through: { attributes: [] },
      attributes: [],
      required: true,
    });
  }

  if (user && user.id) {
    include.push({
      model: UserFavoriteRecipe,
      as: "userFavoriteRecipes",
      where: { userId: user.id },
      attributes: ["userId"],
      required: false,
    });
  }

  const { rows, count } = await Recipe.findAndCountAll({
    where,
    attributes: [
      "id",
      "title",
      "description",
      "thumb",
      "createdAt",
      "updatedAt",
    ],
    include,
    limit: limit,
    offset: getOffset(page, limit),
    order: [["id", "DESC"]],
    distinct: true,
  });

  const recipes = rows.map((recipe) => {
    const { userFavoriteRecipes, ...otherData } = recipe.toJSON();

    return recipe.userFavoriteRecipes
      ? {
          ...otherData,
          isFavorite: recipe.userFavoriteRecipes.length > 0,
        }
      : otherData;
  });

  return { total: count, recipes };
};

/**
 * Gets a single recipe by search term.
 * Returns the recipe's ingredients and fans.
 *
 * @param {number} recipeId
 * @returns {Object|null} The recipe found or null
 */
const getRecipeById = async (recipeId, user) => {
  const recipe = await Recipe.findByPk(recipeId, {
    attributes: {
      exclude: ["ownerId", "areaId", "categoryId"],
    },
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "avatarURL"],
      },
      {
        model: Area,
        as: "area",
        attributes: ["id", "name"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: Ingredient,
        as: "ingredients",
        attributes: ["id", "name", "imgURL"],
        through: {
          as: "recipeIngredient",
          attributes: ["measure"],
        },
      },
    ],
  });

  if (!recipe) throw HttpError(404, "Not found");

  const favorite = await (user
    ? UserFavoriteRecipe.findOne({
        where: { userId: user?.id, recipeId: recipe.id },
      })
    : Promise.resolve(null));

  const recipeJSON = recipe.toJSON();

  return {
    ...recipeJSON,
    isFavorite: user ? !!favorite : undefined,
    ingredients: recipeJSON.ingredients.map(
      ({ recipeIngredient, ...otherData }) => ({
        ...otherData,
        measure: recipeIngredient.measure,
      })
    ),
  };
};

/**
 * Gets a list of popular recipes by number of fans.
 * Works via `getRecipes` with the `popular: true` flag.
 *
 * @param {Object} options - Pagination options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=10] - Number of recipes per page
 *
 * @returns {Object} Result with popular recipes
 */
const getPopularRecipes = async ({ page = 1, limit = 10 }) => {
  const [recipes, total] = await Promise.all([
    Recipe.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "thumb",
        "createdAt",
        "updatedAt",
        [sequelize.fn("COUNT", sequelize.col("fans.id")), "favoritesCount"],
      ],
      include: [
        {
          model: User,
          as: "fans",
          attributes: [],
          through: {
            attributes: [],
            model: UserFavoriteRecipe,
          },
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "avatarURL"],
        },
      ],
      group: ["Recipe.id", "owner.id"],
      order: [
        [sequelize.literal('"favoritesCount"'), "DESC"],
        ["id", "DESC"],
      ],
      limit,
      offset: getOffset(page, limit),
      subQuery: false,
    }),
    Recipe.count(),
  ]);

  const popularRecipes = recipes.map((recipe) => {
    const { favoritesCount, ...otherData } = recipe.toJSON();
    return otherData;
  });

  return {
    total,
    popularRecipes,
  };
};

const addFavorite = async ({ userId, recipeId }) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(404, "Recipe not found");

  await UserFavoriteRecipe.findOrCreate({ where: { userId, recipeId } });
};

const removeFavorite = async ({ userId, recipeId }) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) throw HttpError(404, "Recipe not found");

  const count = await UserFavoriteRecipe.destroy({
    where: { userId, recipeId },
  });

  if (count === 0) throw HttpError(404, "Recipe not found");
};

const getUserFavoriteRecipes = async (userId, settings) => {
  const { page = 1, limit = 10 } = settings;
  const offset = getOffset(page, limit);

  const { count, rows } = await Recipe.findAndCountAll({
    include: [
      {
        model: UserFavoriteRecipe,
        as: "userFavoriteRecipes",
        where: { userId },
        attributes: [],
        required: true,
      },
      { model: User, as: "owner", attributes: ["id", "name", "avatarURL"] },
    ],
    attributes: [
      "id",
      "title",
      "description",
      "thumb",
      "createdAt",
      "updatedAt",
    ],
    offset,
    limit,
    order: [["id", "DESC"]],
  });

  return { total: count, favoriteRecipes: rows };
};

const createRecipe = async ({ body, file, user }) => {
  if (!file) {
    throw HttpError(400, "No file uploaded");
  }

  const thumb = await filesServices.processRecipeThumb(file);

  const { ingredients, ...otherData } = body;

  const recipeIngredients = JSON.parse(ingredients).map(({ id, measure }) => ({
    ingredientId: id,
    measure,
  }));

  const recipe = await Recipe.create(
    {
      ...otherData,
      thumb,
      ownerId: user.id,
      recipeIngredients,
    },
    { include: [{ model: RecipeIngredient, as: "recipeIngredients" }] }
  );

  return recipe;
};

const deleteRecipeById = async (recipeId, user) => {
  const transaction = await sequelize.transaction();

  const recipe = await Recipe.findByPk(recipeId, { transaction });
  if (!recipe) throw HttpError(404, "Recipe not found");
  if (recipe.ownerId !== user.id) throw HttpError(403);

  try {
    await filesServices.removeFile(recipe.thumb);
    await recipe.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const recipesServices = {
  getRecipes,
  getRecipeById,
  getPopularRecipes,
  addFavorite,
  removeFavorite,
  getUserFavoriteRecipes,
  createRecipe,
  deleteRecipeById,
};
