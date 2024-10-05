const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validationReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
// post reviews route
router.post(
  "/",
  isLoggedIn,
  validationReview, 
  wrapAsync(reviewController.craeteReview));
  
  
  //delete review route
  router.delete(
    "/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

    module.exports= router;  
  