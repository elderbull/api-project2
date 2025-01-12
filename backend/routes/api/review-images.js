const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();


//Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const reviewImageId = req.params.imageId;
    const currUsr = req.user.id;

    const imgToDelete = await reviewImage.findByPk(reviewImageId,{
        include: {
            model: Review,
            attributes: ["userId"]
        }
    });


    if(!imgToDelete){
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    };

       if(imgToDelete.Review.userId === currUsr){
        await imgToDelete.destroy();
        return res.status(200).json({
            message: "Successfully deleted"
         });
    } else {
        return res.status(403).json({
            message: "Forbidden"
        });
    }
});

module.exports = router;
