<<<<<<< HEAD
'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'User1',
        email: 'demo@user.io',
        firstName: 'Demo',
        lastName: 'User',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Demo',
        lastName: 'User2',
        email: 'user1@user.io',
        firstName: 'User',
        lastName: '1',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Demo',
        lastName: 'User3',
        email: 'user2@user.io',
        firstName: 'User',
        lastName: '2',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Sauron',
        lastName: 'DarkLord',
        email: 'onering@user.io',
        username: 'DarkLord',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Gandalf',
        lastName: 'Wizard',
        email: 'whitewizard2@user.io',
        username: 'FleeYouFools2',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Frodo',
        lastName: 'Baggins',
        email: 'frodoshire@user.io',
        username: '9Fingers',
        hashedPassword: bcrypt.hashSync('password6')
      }
<<<<<<< HEAD
    ], options, { validate: true });
=======

    ], { validate: true });
<<<<<<< HEAD

=======
>>>>>>> dev
>>>>>>> 90a434d ("trying to fix merge conflict")
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'DarkLord', 'FleeYouFools2', '9Fingers'] }
    }, {});
  }
};
=======
'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'User1',
        email: 'demo@user.io',
        firstName: 'Demo',
        lastName: 'User',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Demo',
        lastName: 'User2',
        email: 'user1@user.io',
        firstName: 'User',
        lastName: '1',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Demo',
        lastName: 'User3',
        email: 'user2@user.io',
        firstName: 'User',
        lastName: '2',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Sauron',
        lastName: 'DarkLord',
        email: 'onering@user.io',
        username: 'DarkLord',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Gandalf',
        lastName: 'Wizard',
        email: 'whitewizard2@user.io',
        username: 'FleeYouFools2',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Frodo',
        lastName: 'Baggins',
        email: 'frodoshire@user.io',
        username: '9Fingers',
        hashedPassword: bcrypt.hashSync('password6')
      }

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'DarkLord', 'FleeYouFools2', '9Fingers'] }
    }, {});
  }
};
>>>>>>> 1ef5993 (correct demo-user file)
