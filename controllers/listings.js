const Listing = require("../models/listing");
require('dotenv').config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MAP_TOKEN='pk.eyJ1IjoicHJhdnVrYWx5YW4iLCJhIjoiY2x3bTNqMnV0MGFtcTJqcWV2MWxnMnluaCJ9._hptcAuCDX6HuUYVFBkNEQ';
//const mapToken = process.env.MAP_TOKEN;
const geocodingClient =mbxGeocoding({accessToken:MAP_TOKEN});

module.exports.index=async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm =(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res,next)=>{
  
    //let {title,description,image,price,country,location} = req.body;
    // let listing = req.body.listing;
    
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
     
   
    let url = req.file.path;
    let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image ={url,filename};
     newListing.geometry =response.body.features[0].geometry;
     let savedListing = await newListing.save();
     console.log(savedListing);
     req.flash("success","New Listing Created!");
     res.redirect("/listings");
}

module.exports.renderEditForm =async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for does not exist!");
       res.redirect("/listings");
   }
   let originalImageUrl = listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing =async(req,res)=>{
    let {id} = req.params;
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing updated!");
    res.redirect("/listings");
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}

module.exports.search = async(req,res)=>{
    const query = req.params.q;
    try {
      const results = await Listing.find({
        "$or": [
          { "title": { $regex: query, $options: "i" } },
          { "country": { $regex: query, $options: "i" } },
          { "location": { $regex: query, $options: "i" } },
          { "speciality": { $regex: query, $options: "i" } }
        ]
      });
      if(results.length===0){
        res.render("listings/error.ejs")
       
      }
      
      console.log(results); // Log the results
      res.render("listings/search.ejs", { data: results }); // Correct path to the EJS file
    } catch (err) {
      console.error('Error during database query:', err); // Log the error with more details
      res.status(500).send({ error: 'Internal Server Error', details: err.message });
    }
  
}

module.exports.trending = async(req,res)=>{
    const trending = await Listing.find({speciality:'Trending'});
    console.log(trending);
    res.render("listings/trending.ejs",{trending});
}

module.exports.rooms =async(req,res)=>{
    const rooms = await Listing.find({speciality:'Rooms'});
    res.render("listings/rooms.ejs",{rooms});
}

module.exports.iconiccities =async(req,res)=>{
    const cities = await Listing.find({speciality:'Iconic cities'});
    console.log(cities);
    res.render("listings/city.ejs",{cities});
}
module.exports.mountains =async(req,res)=>{
    const mountains = await Listing.find({speciality:'Mountains'});
   
    res.render("listings/mountain.ejs",{mountains});
}

module.exports.castles =async(req,res)=>{
    const castles = await Listing.find({speciality:'Castles'});
   
    res.render("listings/castle.ejs",{castles});
}
module.exports.amazingpools =async(req,res)=>{
    const pools = await Listing.find({speciality:'Amazing Pools'});
   
    res.render("listings/pool.ejs",{pools});
}
module.exports.camping =async(req,res)=>{
    const camping = await Listing.find({speciality:'Camping'});
   
    res.render("listings/camp.ejs",{camping});
}
module.exports.farms =async(req,res)=>{
    const farms = await Listing.find({speciality:'Farms'});
   
    res.render("listings/farm.ejs",{farms});
}
module.exports.arctic =async(req,res)=>{
    const arctic = await Listing.find({speciality:'Arctic'});
   
    res.render("listings/arctic.ejs",{arctic});
}
module.exports.domes =async(req,res)=>{
    const domes = await Listing.find({speciality:'Domes'});
   
    res.render("listings/dome.ejs",{domes});
}
module.exports.boats =async(req,res)=>{
    const boats = await Listing.find({speciality:'Boats'});
   
    res.render("listings/boat.ejs",{boats});
}

