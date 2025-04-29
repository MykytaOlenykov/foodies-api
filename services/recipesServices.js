import { Sequelize } from "sequelize";
import { Recipe } from "../db/models/recipes.js";


/**
 * Получает список рецептов с фильтрацией, сортировкой и пагинацией.
 * Может сортировать по популярности, если передан флаг `popular: true`.
 * 
 * @param {Object} options - Параметры запроса
 * @param {number} [options.category] - ID категории рецепта
 * @param {string} [options.ingredient] - Название ингредиента для фильтрации
 * @param {number} [options.area] - ID региона происхождения
 * @param {number} [options.page=1] - Номер страницы для пагинации
 * @param {number} [options.limit=10] - Количество рецептов на страницу
 * @param {string} [options.sort] - Сортировка, например 'title_ASC' или 'time_DESC'
 * @param {boolean} [options.popular=false] - Если true, сортировка по количеству фанатов
 * 
 * @returns {Object} Результат с массивом рецептов, количеством страниц и текущей страницей
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
 * Получает один рецепт по условию поиска.
 * Возвращает ингредиенты и фанатов рецепта.
 * 
 * @param {Object} query - Условие поиска (например, { id: 1 })
 * @returns {Object|null} Найденный рецепт или null
 */
const getOneRecip = (query) => {
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
 * Получает список популярных рецептов по количеству фанатов.
 * Работает через `getRecipes` с флагом `popular: true`.
 * 
 * @param {Object} options - Параметры пагинации
 * @param {number} [options.page=1] - Номер страницы
 * @param {number} [options.limit=10] - Количество рецептов на страницу
 * 
 * @returns {Object} Результат с популярными рецептами
 */
const getPopularRecips = async ({ page, limit }) => {
  return await getRecipes({ page, limit, popular: true });
};

export const recipesServices = {
  getRecipes,
  getOneRecip,
  getPopularRecips,
};
