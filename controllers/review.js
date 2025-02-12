const Listing = require("../models/listing");
const Review  = require("../models/review");

module.exports.craeteReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // Ensure that reviews is an array before pushing a new review
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");

  
    res.redirect(`/listings/${listing._id}`);
  };


  module.exports.destroyReview = async (req, res)=>{
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
  };
  