const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validationListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// Listing routes
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validationListing,
    wrapAsync(listingController.createListing)
  );

// Render form for new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show specific listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validationListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Fixed typo from 'destoryListing' to 'destroyListing'

// Render form for editing specific listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
