// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, spotImage, reviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];


// Get all of the Current User's Bookings
router.get('/bookings', requireAuth, async (req, res) => {

  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"]
        },
        include: {
          model: spotImage,
          attributes: ['url'],
          where: { preview: true }, required: false
        },
      }
    ]
  })

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i].toJSON();
    if (booking.Spot) {
      bookings[i] = booking;
      if (booking.Spot.previewImage = booking.Spot.spotImages.length) {
        booking.Spot.previewImage = booking.Spot.spotImages[0].url
      } else {
        booking.Spot.previewImage = null
      }
      delete booking.Spot.spotImages;
    }
  }

  return res.status(200).json({ Bookings: bookings })
});


//Get all reviews owned by the current user
router.get('/reviews', requireAuth, async (req, res, next) => {
  const  currUsr = req.user.id;

  const reviews = await Review.findAll({
    where: {
        userId: currUsr
    },
    include: [
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: Spot,
            attributes: {
                exclude: ["description", "createdAt", "updatedAt"]
            },
            include: {
                model: spotImage,
                attributes: ['url'],
                where: { preview: true }
            },
        },
        {
            model: reviewImage,
            attributes: ['id', 'url']
        }
    ]
})

for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i].toJSON();
    if (review.Spot) {
        reviews[i] = review;
        review.Spot.previewImage = review.Spot.spotImages[0].url;
        delete review.Spot.spotImages;
    }
}
return res.status(200).json({ Reviews: reviews });




} );

// GET all spots owned by the current user
router.get('/spots', requireAuth, async (req, res, next) => {
  const  currUsr = req.user.id;

  const allSpots = await Spot.findAll({
      where: {
        ownerId:currUsr
      },
      include: [
          {
              model: Review
          },
          {
              model: spotImage,
              where: {
                  preview: true
              },
              attributes: {
                  exclude: ['id', 'spotId', 'preview', 'createdAt', 'updatedAt']
              }
          }
      ]
  });

  const allSpotsCopy = [];

  allSpots.forEach(spot => {
      let starsArr = [];
      let spotCopy = spot.toJSON();

      for (let review of spot.Reviews) {
          starsArr.push(review.stars);
      }

      if (starsArr.length) {
          const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

          spotCopy.avgRating = sumStars / spot.Reviews.length;
          delete spotCopy.Reviews;
      } else {
          spotCopy.avgRating = null;
          delete spotCopy.Reviews;
      }


      spotCopy.previewImage = spot.spotImages[0].url;
      delete spotCopy.spotImages;

      allSpotsCopy.push(spotCopy)
  })

  res.json({ "Spots": allSpotsCopy });


} );

router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);

// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

  // Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

module.exports = router;
