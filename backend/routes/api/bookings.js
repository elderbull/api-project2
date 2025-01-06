//backend/routes/api/bookings.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, reviewImage, spotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

const validateBooking = [
    check('startDate')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Start date is required'),
    check('endDate')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('End date is required'),
    handleValidationErrors
  ];

//Edit a Booking
router.put("/:bookingId", requireAuth, validateBooking, async (req, res, next) => {

    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking couldn't be found"
      })
    }
    if (booking.userId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(booking.spotId);

    if (new Date(startDate) < new Date()) {
      return res.status(403).json({
        message: "Past bookings can't be modified",
      });
    }

    const otherBookings = await Booking.findAll({
      where: {
        spotId: spot.id,
        id: { [Op.ne]: booking.id }, // Exclude current booking
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

    if (otherBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    await booking.update({
      startDate: startDate,
      endDate: endDate,
      updatedAt: new Date(),
    });

    return res.status(200).json(booking)
});

//Delete a booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
    const currUsr = req.user.id;

    const bookingFromId = await Booking.findOne({
        where: {
            id: req.params.bookingId
        },
        attributes: {
            include: ['id']
        }
    });

    if (!bookingFromId) {
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found"
          })
    }

    const spot = await Spot.findOne({
        where: {
            id: bookingFromId.spotId
        }
    });


    if (bookingFromId.userId === currUsr || spot.ownerId === currUsr) {
        const today = new Date();
        const bookingStartDate = new Date(bookingFromId.startDate)
        if(bookingStartDate <= today) {
            return res.status(403).json(
                {
                    message: "Bookings that have been started can't be deleted"
                });
        } else {
            await bookingFromId.destroy();
            return res.status(200).json(
                { "message": "Successfully deleted"

                 });
        }
    } else {
        return res.json({ message: 'You are not authorized to delete this booking' })
    };
});

module.exports = router;
