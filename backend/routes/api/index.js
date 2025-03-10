// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const spotImagesRouter = require('./spot-images.js');
const reviewImagesRouter = require('./review-images.js');
const { restoreUser } = require('../../utils/auth.js')
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);
router.use('/spot-images', spotImagesRouter);
router.use('/review-images', reviewImagesRouter);


router.get("/", async(req, res) => {
  res.status(200).json({
    welcome:"Welcome to Leon Bull's Mod 4 Project",
    program:"AppAcademy",
    instructor: "Marlon Santos"
  })
})

//Test route
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });


module.exports = router;
