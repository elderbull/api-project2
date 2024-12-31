//backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { DataTypes, Op } = require('sequelize');

const router = express.Router();


//Get details of Spot from id
router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId

    const spot = await Spot.findByPK({
        where: {
            id: id
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
        attributs: {
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

    spotDup.spotImages = spotImages;
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
                model: spotImage,
                where: {
                    preview:true
                },
                attributes: {
                    exclude: ['id', 'spotId', 'preview','createdAt', 'updatedAt']
                }
            }
        ]
    });

    res.status(200).json(allSpots);

} );


module.exports = router;
