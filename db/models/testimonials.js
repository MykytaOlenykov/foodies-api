import { DataTypes, Model } from "sequelize";

export class Testimonial extends Model {
  static initModel(sequelize) {
    Testimonial.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        testimonial: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        ownerId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Testimonial",
        tableName: "testimonials",
        timestamps: true,
      }
    );
  }

  static associate(sequelize) {
    const { User } = sequelize.models;

    Testimonial.belongsTo(User, {
      foreignKey: "ownerId",
      as: "owner",
    });
  }
}

export default Testimonial;