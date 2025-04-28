import { DataTypes, Model } from "sequelize";

export class RecipeIngredient extends Model {
  static initModel(sequelize) {
    RecipeIngredient.init(
      {
        ingredientId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Ingredient",
            key: "id",
          },
          allowNull: false,
        },
        recipeId: {
          type: DataTypes.INTEGER,
          references: {
            model: "Recipe",
            key: "id",
          },
          allowNull: false,
        },
        measure: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "RecipeIngredient",
        tableName: "recipeIngredients",
        timestamps: false,
      }
    );
  }
}
