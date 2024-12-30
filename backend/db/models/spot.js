'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(
        models.Booking, {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );

      Spot.hasMany(
        models.Review, {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );

      Spot.belongsTo(
        models.User, {
          foreignKey: 'ownerId'
        }
      );

      Spot.hasMany(
        models.spotImage, {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );


    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required() {
          if (!this.address) {
            throw new Error('Street address is required')
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required() {
          if (!this.city) {
            throw new Error('City is required')
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required() {
          if (!this.state) {
            throw new Error('State is required')
          }
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        required() {
          if (!this.country) {
            throw new Error('Country is required')
          }
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        checkLat() {
          if (this.lat < -90 || this.lat > 90) {
            throw new Error('Latitude must be within -90 and 90')
          }
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        checkLng() {
          if (this.lng < -180 || this.lng > 180) {
            throw new Error('Longitude must be iwthin -180 and 180')
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkLength() {
          const len = this.name.length;
          if (len >= 50) {
            throw new Error('Name must be less than 50 characters')
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isRequired(){
          if (!this.description) {
            throw new Error("Description is required")
          }
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isPositive() {
          if (this.price < 0) {
            throw new Error("Price per day must be a positive number")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
