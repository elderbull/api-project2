'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 3,
        userId: 1,
        startDate: '2025-05-15',
        endDate: '2025-05-22'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2025-04-30',
        endDate: '2025-05-06'
      },
      {
        spotId: 3,
        userId: 5,
        startDate: '2025-06-04',
        endDate: '2025-06-15'
      },
      {
       spotId: 2,
       userId: 6,
       startDate: '2025-05-07',
       endDate: '2025-05-14'
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [3, 2, 3] }
    }, {});
  }
};
