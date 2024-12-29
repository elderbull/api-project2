'use strict';

const { spotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await spotImage.bulkCreate([
    {
      spotId: 1,
      url: 'https://www.pexels.com/photo/door-of-a-hobbit-hole-24414786/',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://images4.alphacoders.com/842/842661.jpg',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://cottagesonroanokeisland.com/sites/default/files/business/52044/slideshow/01-island-loft.jpg',
      preview: true
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "spotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
