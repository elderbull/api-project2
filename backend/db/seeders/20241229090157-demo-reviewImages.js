'use strict';

const { reviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await reviewImage.bulkCreate([
    {
      reviewId: 1,
      url: 'https://example.com/image1.png'
    },
    {
      reviewId: 2,
      url: 'https://example.com/image2.png'
    },
    {
      reviewId: 3,
      url: 'https://example.com/image3.png'
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "reviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
