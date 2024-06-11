const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({storage});



router
   .route("/")
   .get(wrapAsync(listingController.index ))
   .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

router.route("/search/:q").get(wrapAsync(listingController.search));
   
router.route("/trending").get(wrapAsync(listingController.trending));
router.route("/rooms").get(wrapAsync(listingController.rooms));
router.route("/iconiccitys").get(wrapAsync(listingController.iconiccities));
router.route("/mountains").get(wrapAsync(listingController.mountains));
router.route("/castles").get(wrapAsync(listingController.castles));
router.route("/amazingpools").get(wrapAsync(listingController.amazingpools));
router.route("/camping").get(wrapAsync(listingController.camping));
router.route("/farms").get(wrapAsync(listingController.farms));
router.route("/arctic").get(wrapAsync(listingController.arctic));
router.route("/domes").get(wrapAsync(listingController.domes));
router.route("/boats").get(wrapAsync(listingController.boats));
//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


//Index Route
//router.get("/",wrapAsync(listingController.index ));

//New Route
//router.get("/new",isLoggedIn,listingController.renderNewForm);

//Show Route
//router.get("/:id",wrapAsync( listingController.showListing));

//Create Route
//router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
 
 //Edit Route
 //router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 
 //Update Route
 //router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
 
 //Delete Route
 //router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

 module.exports =router;
 
