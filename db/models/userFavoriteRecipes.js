import { DataTypes, Model } from "sequelize";

export class UserFavoriteRecipe extends Model {
  static initModel(sequelize) {
    UserFavoriteRecipe.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: "User",
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
      },
      {
        sequelize,
        modelName: "UserFavoriteRecipe",
        tableName: "userFavoriteRecipes",
        timestamps: false,
      }
    );
  }
}
