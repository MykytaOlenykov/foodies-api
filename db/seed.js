import fs from "node:fs/promises";
import path from "node:path";

import { v4 as uuidv4 } from "uuid";

import { hashSecret } from "../helpers/hashing.js";
import {
  sequelize,
  Area,
  Category,
  Ingredient,
  Recipe,
  Testimonial,
  User,
  RecipeIngredient,
} from "./sequelize.js";

const seedsDirPath = path.resolve("db", "data");

export const readRawSeedData = async (seedFileName) => {
  const filePath = path.join(seedsDirPath, seedFileName);
  const data = await fs.readFile(filePath);
  return JSON.parse(data);
};

const getRawUsers = async () => await readRawSeedData("users.json");

const findUserId = (rawId, rawUsers, createdUsers) => {
  const rawUser = rawUsers.find(({ _id: { $oid } }) => $oid === rawId);
  if (!rawUser) return null;
  return createdUsers.find(({ email }) => email === rawUser.email)?.id ?? null;
};

const getRawIngredients = async () => await readRawSeedData("ingredients.json");

const findIngredientId = (rawId, rawIngredients, createdIngredients) => {
  const rawIngredient = rawIngredients.find(({ _id }) => _id === rawId);
  if (!rawIngredient) return null;
  return (
    createdIngredients.find(({ name }) => name === rawIngredient.name)?.id ??
    null
  );
};

// Seeds
const seedAreas = async ({ transaction }) => {
  const data = await readRawSeedData("areas.json");
  return await Area.bulkCreate(
    data.map(({ name }) => ({ name })),
    { transaction }
  );
};

const seedCategories = async ({ transaction }) => {
  const data = await readRawSeedData("categories.json");
  return await Category.bulkCreate(
    data.map(({ name }) => ({ name })),
    { transaction }
  );
};

const seedIngredients = async ({ rawIngredients, transaction }) => {
  return await Ingredient.bulkCreate(
    rawIngredients.map(({ name, desc, img }) => ({ name, desc, imgURL: img }), {
      transaction,
    })
  );
};

const seedRecipes = async ({
  rawUsers,
  createdUsers,
  areas,
  categories,
  createdIngredients,
  rawIngredients,
  transaction,
}) => {
  const data = await readRawSeedData("recipes.json");

  const recipesToCreate = [];

  for (const {
    title,
    category,
    owner: { $oid },
    area,
    instructions,
    description,
    thumb,
    time,
    ingredients,
  } of data) {
    const ownerId = findUserId($oid, rawUsers, createdUsers);
    if (!ownerId) continue;

    const areaId = areas.find(({ name }) => name === area)?.id ?? null;
    if (!areaId) continue;

    const categoryId =
      categories.find(({ name }) => name === category)?.id ?? null;
    if (!categoryId) continue;

    const recipeIngredients = ingredients
      .map(({ id, measure }) => ({
        ingredientId: findIngredientId(id, rawIngredients, createdIngredients),
        measure,
      }))
      .filter(({ ingredientId }) => !!ingredientId);

    recipesToCreate.push({
      title,
      instructions,
      description,
      thumb,
      time: Number(time),
      ownerId,
      areaId,
      categoryId,
      recipeIngredients,
    });
  }

  await Recipe.bulkCreate(recipesToCreate, {
    include: [{ model: RecipeIngredient, as: "recipeIngredients" }],
    transaction,
  });
};

const seedTestimonials = async ({ rawUsers, createdUsers, transaction }) => {
  const data = await readRawSeedData("testimonials.json");
  const testimonialsData = data
    .map(({ testimonial, owner: { $oid: ownerId } }) => ({
      testimonial,
      ownerId: findUserId(ownerId, rawUsers, createdUsers),
    }))
    .filter(({ ownerId }) => !!ownerId);
  return await Testimonial.bulkCreate(testimonialsData, { transaction });
};

const seedUsers = async ({ rawUsers, transaction }) => {
  const userData = await Promise.all(
    rawUsers.map(async ({ name, avatar, email }) => ({
      name,
      email,
      avatarURL: avatar,
      password: await hashSecret(uuidv4()),
    }))
  );

  return await User.bulkCreate(userData, { transaction });
};

const initDb = async () => {
  const rawUsers = await getRawUsers();
  const rawIngredients = await getRawIngredients();

  const transaction = await sequelize.transaction();

  try {
    const areas = await seedAreas({ transaction });
    const categories = await seedCategories({ transaction });
    const ingredients = await seedIngredients({ rawIngredients, transaction });
    const users = await seedUsers({ rawUsers, transaction });

    await seedTestimonials({ rawUsers, createdUsers: users, transaction });
    await seedRecipes({
      rawUsers,
      createdUsers: users,
      areas,
      categories,
      rawIngredients,
      createdIngredients: ingredients,
      transaction,
    });

    await transaction.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to seed database, rolled back.", error);
  }
};

initDb();
