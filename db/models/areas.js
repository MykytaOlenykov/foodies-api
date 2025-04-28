import { DataTypes, Model } from "sequelize";

export class Area extends Model {
  static initModel(sequelize) {
    Area.init(
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
      },
      {
        sequelize,
        modelName: "Area",
        tableName: "areas",
        timestamps: false,
      }
    );
  }
}
