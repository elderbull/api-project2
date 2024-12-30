'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.Spot, {
          foreignKey: 'spotId'
        });

      Review.belongsTo(
        models.User, {
          foreignKey: 'userId'
        });

      Review.hasMany(
        models.reviewImage, {
          foreignKey: 'reviewId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )

    }
  }
  Review.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    review: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        rangeStars() {
          if(this.stars < 1 || this.stars > 5) {
            throw new Error('Stars must be an integer from 1 to 5');
          };
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
