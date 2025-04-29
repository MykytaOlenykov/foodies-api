import { Sequelize } from "sequelize";
import { Recipe } from "../db/models/recipes.js";



/**
* Gets a list of recipes with filtering, sorting and pagination.
* Can sort by popularity if `popular: true` flag is passed.
*
* @param {Object} options - Query parameters
* @param {number} [options.category] - Recipe category ID
* @param {string} [options.ingredient] - Ingredient name to filter
* @param {number} [options.area] - Origin region ID
* @param {number} [options.page=1] - Page number for pagination
* @param {number} [options.limit=10] - Number of recipes per page
* @param {string} [options.sort] - Sort by, such as 'title_ASC' or 'time_DESC'
* @param {boolean} [options.popular=false] - If true, sort by number of fans
*
* @returns {Object} Result with array of recipes, number of pages, and current page
*/

const getRecipes = async ({ category, ingredient, area, page, limit, sort, popular = false }) => {
  const where = {};
  if (category) where.categoryId = category;
  if (area) where.areaId = area;

  const offset = (page - 1) * limit;
  const include = [];

  if (ingredient) {
    include.push({
      model: Recipe.sequelize.models.Ingredient,
      as: "ingredients",
      where: { name: ingredient },
      through: { attributes: [] },
      attributes: [],
    });
  }

  if (popular) {
    include.push({
      model: Recipe.sequelize.models.User,
      as: "fans",
      attributes: [],
      through: { attributes: [] },
    });
  }

  const order = [];

  if (popular) {
    order.push([Sequelize.literal(`"fansCount"`), "DESC"]);
  } else if (sort) {
    const [field, direction] = sort.split("_");
    order.push([field, direction.toUpperCase()]);
  }

  const findOptions = {
    where,
    offset,
    limit: Number(limit),
    include,
    ...(order.length && { order }),
    ...(popular && {
      attributes: {
        include: [[Sequelize.fn("COUNT", Sequelize.col("fans.id")), "fansCount"]],
      },
      group: ["Recipe.id"],
      subQuery: false,
    }),
  };

  const countOptions = { where };

  if (ingredient) {
    countOptions.distinct = true;
    countOptions.col = "id";
    countOptions.include = [
      {
        model: Recipe.sequelize.models.Ingredient,
        as: "ingredients",
        where: { name: ingredient },
        through: { attributes: [] },
      },
    ];
  } else if (popular) {
    const [rows] = await Recipe.sequelize.query(`
      SELECT DISTINCT "recipeId"
      FROM "userFavoriteRecipes"
    `);

    const total = rows.length;
    const recipes = await Recipe.findAll(findOptions);

    return {
      recipes,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  const [recipes, total] = await Promise.all([
    Recipe.findAll(findOptions),
    Recipe.count(countOptions),
  ]);

  return {
    recipes,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};


/**
* Gets a single recipe by search term.
* Returns the recipe's ingredients and fans.
*
* @param {Object} query - The search term (e.g. { id: 1 })
* @returns {Object|null} The recipe found or null
*/
const getOneRecipe = (query) => {
  return Recipe.findOne({
    where: query,
    include: [
      {
        model: Recipe.sequelize.models.Ingredient,
        as: "ingredients",
        through: { attributes: [] },
      },
      {
        model: Recipe.sequelize.models.User,
        as: "fans",
        attributes: ["id"],
        through: { attributes: [] },
      },
    ],
  });
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
const getPopularRecipes = async ({ page, limit }) => {
  return await getRecipes({ page, limit, popular: true });
};

export const recipesServices = {
  getRecipes,
  getOneRecipe,
  getPopularRecipes,
};
