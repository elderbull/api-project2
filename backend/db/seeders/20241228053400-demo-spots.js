'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 6,
        address: '1 Bagshot Row',
        city: 'Hobbiton',
        state: 'Middle-Earth',
        country: 'Tolkien',
        lat: 51,
        lng: 2,
        name: 'Hobbit-hole',
        description: 'A comfortable, labrythine home with a welcoming cluttter, pretty gardens, and an old oak tree whose roots twish through its halls. Peaceful, relaxing and wonderful meals!',
        price: 125
      },
      {
        ownerId: 4,
        address: '666 Wrong Turn Rd',
        city: 'Mordor',
        state: 'Middle-Earth',
        country: 'Tolkien',
        lat: 85,
        lng: 5,
        name: 'Mount Doom',
        description: 'Great vacation spot for the cold blooded in nature. Overlooking the land of evil and a breath taking view of molten lava. Servants at every turn waiting to serve you!',
        price: 75
      },
      {
        ownerId: 1,
        address: '25 Manteo Beach',
        city: 'Outer Banks',
        state: 'North Carolina',
        country: 'USA',
        lat: 51,
        lng: 2,
        name: 'The Island Loft ',
        description: 'Nestled in the heart of Sandy Bay, the condo is spread over two floors with 3 bedrooms and 2 bathrooms, full kitchen and living area not to mention the spacious outdoor deck. Ceiling fans and split AC units ensure a cool and comfortable environment for you or your guests.',
        price: 250
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: {
        [Op.in]: ['1 Bagshot Row','666 Wrong Turn Rd','25 Manteo Beach']
      }
    }, {})
  }
};
