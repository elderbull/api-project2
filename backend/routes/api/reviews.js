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

  //get one review - Test to pull review
  router.get('/single/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);
    return res.status(201).json(review)
  })


//Add an Image to a Review based on the Review's Id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;
    const currUsr = req.user.id;


    const review = await Review.findOne({
        where: {
            id: reviewId
        }
    });

    if (!review) {
        res.status(404);
        return res.json({
            "message": "Review couldn't be found"
          })
    }

    if (currUsr !== review.userId) {
            return res.status(403).json({ message: "Forbidden" });
          }


    const imgCount = await reviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })

    // Checking the number of images for this review
    if (imgCount.length >= 10) {
        res.status(403);
        return res.json({
            "message": "Maximum number of images for this resource was reached"
          })
    }

    const newReviewImage = await reviewImage.create({ reviewId, url })

    const imgToAdd = newReviewImage.toJSON();

    delete imgToAdd.reviewId;
    delete imgToAdd.updatedAt;
    delete imgToAdd.createdAt;

    res.status(201);
    return res.json(imgToAdd)
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

    if (currUserId === review.userId) {
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
