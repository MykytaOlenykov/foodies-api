import { DataTypes, Model } from "sequelize";

export class Recipe extends Model {
  static initModel(sequelize) {
    Recipe.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ownerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        areaId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        instructions: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        thumb: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        time: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Recipe",
        tableName: "recipes",
        timestamps: true,
      }
    );
  }

  static associate(sequelize) {
    const {
      Category,
      User,
      Area,
      Ingredient,
      RecipeIngredient,
      UserFavoriteRecipe,
    } = sequelize.models;

    Recipe.belongsTo(Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Recipe.belongsTo(User, {
      foreignKey: "ownerId",
      as: "owner",
    });

    Recipe.belongsTo(Area, {
      foreignKey: "areaId",
      as: "area",
    });

    Recipe.belongsToMany(Ingredient, {
      through: RecipeIngredient,
      foreignKey: "recipeId",
      as: "ingredients",
      otherKey: "ingredientId",
    });

    Recipe.belongsToMany(User, {
      through: UserFavoriteRecipe,
      as: "fans",
      foreignKey: "recipeId",
      otherKey: "userId",
    });
  }
}
