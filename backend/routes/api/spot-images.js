const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

//Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const spotImageId = req.params.imageId;
    const currUsr = req.user.id;

    const imgToDelete = await spotImage.findByPk(spotImageId, {
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    });

    if(!imgToDelete){
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    };

    const spot = await Spot.findOne({
        where: {
            id: imgToDelete.spotId
        }
    })

    if(spot.ownerId !== currUsr){
        return res.status(403).json({
            message: "Forbidden"
        })
    };

    await imgToDelete.destroy();
    return res.status(200).json({
        message: "Successfully deleted"
    });
});

module.exports = router;
