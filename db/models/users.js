import { DataTypes, Model } from "sequelize";

export class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatarURL: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
      }
    );
  }

  static associate(sequelize) {
    const { Recipe, UserFollower, UserFavoriteRecipe } = sequelize.models;

    User.belongsToMany(User, {
      through: UserFollower,
      as: "following",
      foreignKey: "followerId",
      otherKey: "userId",
    });

    User.belongsToMany(User, {
      through: UserFollower,
      as: "followers",
      foreignKey: "userId",
      otherKey: "followerId",
    });

    User.belongsToMany(Recipe, {
      through: UserFavoriteRecipe,
      as: "favoriteRecipes",
      foreignKey: "userId",
      otherKey: "recipeId",
    });

    User.hasMany(Recipe, {
      as: "recipes",
      foreignKey: "ownerId",
    });
  }
}
