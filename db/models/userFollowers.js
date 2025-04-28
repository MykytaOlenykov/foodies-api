import { DataTypes, Model } from "sequelize";

export class UserFollower extends Model {
  static initModel(sequelize) {
    UserFollower.init(
      {
        followerId: {
          type: DataTypes.INTEGER,
          references: {
            model: "User",
            key: "id",
          },
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: "User",
            key: "id",
          },
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "UserFollower",
        tableName: "userFollowers",
        timestamps: false,
      }
    );
  }
}
