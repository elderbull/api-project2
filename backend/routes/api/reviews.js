//backend/routes/api/reviews.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

// validate the reviews
const validateReviews = [
    check('review')
      .exists({checkFalsy: true})
      .withMessage('Review text is required'),
    check('stars')
      .exists({checkFalsy: true})
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

//Add an Image to a Review based on the Review's Id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
	const { currUserId } = req.user.id;
    const { reviewId } = req.params.reviewId;
	const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
		return res.status(404).json({
			message: "Review couldn't be found",
		});
	}

	if (parseInt(currUserId) !== review.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

	const existingImages = await reviewImage.count({ where: { reviewId } });
	if (existingImages >= 10) {
		return res.status(403).json({
			message: "Maximum number of images for this resource was reached",

		});
	}

    const newImage = await reviewImage.create({
		reviewId,
		url,
	}, {
		include: [{ model: Review }],
		attributes: ['id', 'url']
	});
	return res.status(201).json({
		id: newImage.id,
		url: newImage.url,
	});
});

//Edit a review
router.put('/:reviewId', requireAuth, validateReviews, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const { review, stars} = req.body;
    const currentUserId = req.user.id;

    const currReview = await Review.findByPk(reviewId);

    if (!currReview){
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    };

    if (Number(currReview.userId) !== Number(currentUserId)){
        return res.status(403).json({
            message: "Forbidden"
        })
    };

    const updatedReview = await currReview.update({
        review,
        stars
    });

    return res.json(updatedReview);

});

//Delete a review
router.delete('/:reviewId', requireAuth, async (req,res,next) => {
    const currUserId = req.user.id;
    const reviewId = req.params.reviewId;

    const review = await Review.findByPk(reviewId);

    if(!review) {
        return res.status(404).json({
            message: "Review couldn't be found!"
        })
    };

    if (pareInt(currUserId) === review.userId) {
        await review.destroy();
        return res.status(200).json({
            message: "Successfully deleted"
        })
    } else {
        return res.status(403).json({
           message: "Forbidden"
        })
    }

});

module.exports = router;
