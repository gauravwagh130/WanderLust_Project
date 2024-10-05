const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings"); // Ensure you use `return` to stop further execution
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; // Save image as an object
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings"); // Use `return` here as well
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  try {
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  
  try {
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", "Failed to delete listing. Please try again.");
    res.redirect("/listings");
  }
};
