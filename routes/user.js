const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup))
// Render signup page

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
   userController.login
  )
// Handle signup form submission
// Render login page


// Handle login form submission


// Handle logout
router.get("/logout", userController.logout );

module.exports = router;
