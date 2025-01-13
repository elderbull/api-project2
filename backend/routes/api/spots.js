//backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

//added validation of spot
const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage("Country is required"),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude is not valid"),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage("Name must be less than 50 characters")
      .isLength({ max: 50 })
      .withMessage("Name must be less than 50 characters"),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage("Description is required"),
    check('price')
      .exists({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage("Price per day must be a positive number"),
    handleValidationErrors
  ];

  //Validation for reviews
const validateReview = [
    check("review")
      .exists({ checkFalsy: true })
      .withMessage("Review text is required"),
    check("stars")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors,
  ];

  //Validation for Bookings
  const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isDate()
        .isAfter()
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .exists({ checkFalsy: true }),
    check('startDate')
        .custom((endDate, { req }) => (endDate >= req.body.startDate))
        .withMessage("endDate cannot be on or before startDate"),
    handleValidationErrors
];


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const currUsr = req.user.id;
    const spotId = req.params.spotId;
    const getSpot = await Spot.findByPk(spotId);

    if (!getSpot) {
        return res.status(200).json({
            message: "Spot couldn't be found"
        })
    };

    const bookingsOwner = await Booking.findAll({
        where: {
            spotId: spotId
        },
        include: [{
            model:User,
            attributes: ['id', 'firstName', 'lastName']
        }]
    });

    const bookingsNotOwner = await Booking.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['spotId', 'startDate', 'endDate']
    });

    if (getSpot.ownerId !== currUsr){
        return res.status(200).json({Bookings:bookingsNotOwner})
    } else {
        return res.status(200).json({Bookings:bookingsOwner})
    };

});

//Get all reviews by a Spot's id
router.get('/:spotId/reviews', async (req,res,next) => {

    const spotId = req.params.spotId

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json(
        {
          message: "Spot couldn't be found"
        }
      )
    }

    const spotReviews = await Review.findAll({
      where: {
        spotId: spotId,
      },

      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: reviewImage,
          attributes: ['id', 'url']
        }
      ]
    })
    return res.status(200).json({ Reviews: spotReviews });

});

//Get details of Spot from id
router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId

    const spot = await Spot.findOne({
        where: {
            id:id
        },
        include: [
            {
                model: spotImage,
                required: false
            },
            User,
            {
                model: Review,
                required: false
            }
        ]
    });

    if (!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
        })
    };

    const owner = await User.findOne({
        where: {
            id: spot.ownerId
        },
        attributes: {
            exclude: ['username']
        }
    });

    const spotImages = await spotImage.findAll({
        where: {
            spotId: id,
        },
        attributes: {
            exclude: ['spotId','createdAt', 'updatedAt']
        }
    });

    const spotDup = spot.toJSON();

    spotDup.numReviews = spot.Reviews.length;

    let starsArr = [];

    for (let review of spot.Reviews) {
        starRating = review.stars;
        starsArr.push(starRating)
    }

    if (starsArr.length) {
        const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

        spotDup.avgRating = sumStars / spotDup.Reviews.length;
        delete spotDup.Reviews;
    } else {
        spotDup.avgRating = null;
        delete spotDup.Reviews;
    }

    spotDup.SpotImages = spotImages;
    delete spotDup.spotImages
    spotDup.Owner = owner
    delete spotDup.User
    return res.status(200).json(spotDup);

});


//Get All Spots
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: spotImage,
                // where: {
                //     preview: true
                // },
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

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const spotId = req.params.spotId;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const getSpot = await Spot.findByPk(spotId);

    if (!getSpot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        })
    };

    if (getSpot.ownerId === userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    };

    //Booking conflict error

    const checkBookings = await Booking.findAll({
        where: {
          spotId: getSpot.id,
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: startDate } },
                { endDate: { [Op.gte]: endDate } },
              ],
            },
          ],
        },
      });

      if (checkBookings.length > 0) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      };

      const newBooking = await Booking.create({
        spotId: spotId,
        userId,
        startDate,
        endDate
      });

      return res.status(201).json(newBooking)
});


//Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const { user } = req;

    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!spot) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }

    if (spot.ownerId === user.id) {
        const newSpotImage = await spotImage.create(
            {
                spotId: req.params.spotId, url, preview
            });

        newImageCopy = newSpotImage.toJSON();
        delete newImageCopy.spotId;
        delete newImageCopy.updatedAt;
        delete newImageCopy.createdAt;

        res.status(201);
        return res.json(newImageCopy)
    } else {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }
  });

  //Create a review for a Spot based on the Spot's id
  router.post('/:spotId/reviews', requireAuth, validateReview, async (req,res,next) => {

    const currentUserId = req.user.id;
    const spotId = req.params.spotId;

    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json(
            {
            message: "Spot couldn't be found"
        })
    };

    const reviewExist = await Review.findOne({
        where: {
            userId: currentUserId, spotId: spotId
        }
    });

    if(reviewExist) {
        return res.status(500).json({
            message: "User already has a review for this spot"
        })
    };

    const newReview = await Review.create({
        userId: currentUserId,
        spotId: parseInt(spotId),
        review,
        stars
    })

    res.status(201).json(newReview);
  });

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const { user } = req;

    let userId;

    if (user) {
        userId = user.id;
    }

    const newSpot = await Spot.create({
        "ownerId": userId,
        "address": address,
        "city": city,
        "state": state,
        "country": country,
        "lat": lat,
        "lng": lng,
        "name": name,
        "description": description,
        "price": price
    });

    res.status(201).json(newSpot);
})

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json(
        {
          message: "Spot couldn't be found"
        })
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }

    const updatedSpot = await spot.update(req.body);
    return res.status(200).json(updatedSpot)
  });

  //delete a spot ***********************************************
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId;

    const spotToDelete = await Spot.findOne({
        where: {
            id: spotId,
        },
    });

    if (!spotToDelete) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }

    if (spotToDelete.ownerId === user.id) {
        await spotToDelete.destroy();
        res.status(200);
        return res.json({ "message": "Successfully deleted" })
    } else {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }

});




module.exports = router;
