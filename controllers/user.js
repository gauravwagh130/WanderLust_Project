const User = require("../models/user");

module.exports.renderSignupForm= (req, res) => {
    res.render("users/signup.ejs");
  };
module.exports.signup= async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      // Log the user in automatically after registration
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err); // If an error occurs during login, pass it to the next middleware
        }
        req.flash("success", "Welcome to WanderLust!");
        return res.redirect("/listings"); // Only redirect once after successful login
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/signup"); // Ensure only one response is sent in case of error
    }
  };

  module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  };

  module.exports.login =async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err); // Correct error handling, call next once
      }
      req.flash("success", "You are logged out");
      res.redirect("/listings");
    });
  };