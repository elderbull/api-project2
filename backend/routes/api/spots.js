//backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { DataTypes } = require('sequelize');

const router = express.Router();

//Get All Spots
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review
            },
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
