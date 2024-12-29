'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 3,
        review: "Relaxing and quaint town.",
        stars: 4
      },
      {
        userId: 2,
        spotId: 2,
        review: "Not what I was epecting. Too hot! Strange and scary creatures everywhere.",
        stars: 1
      },
      {
        userId: 6,
        spotId: 2,
        review: "Never returning. I accomplished destroying the ring and ended up with my finger being bitten up.",
        stars: 1
      },
      {
        userId: 4,
        spotId: 1,
        review: "Lovely place to rule. The Orcs will have a great time with the little people.",
        stars: 5
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4 ,5 ,6]}
    }, {})
  }
};
