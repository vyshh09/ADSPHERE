const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AdModel = require('../models/advertisment');

const renameFile = require("../utils/utils")
const mapOrders = require('../utils/mapOrders');

// for storing images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
      // images in a static folder
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
   
      // initially, we name the file to be "_default", later on we will rename it with the "ad_id.extension"
      cb(null, req.session.email + "_default" + ext);
    },
});
const upload = multer({ storage: storage })

router.post('/ad-upload', upload.single('ad_design'), async (req, res) => {
  
    // session check for advertiser
    if (!req.session.email || req.session.type.toLowerCase() !== "advertiser") {
      res.json({ success: false, message: "Unauthorized!" })
      return
    }
  
    try {
      const { ad_category, ad_description, target_prints, ad_region, qr_link_id, ad_type, ad_target_age, websiteUrl } = req.body;
      
      const { originalname, buffer, mimetype } = req.file;
  
      const ad_id = `${req.session.email}_${Math.floor(Date.now() / 1000)}`
      const ext = path.extname(originalname).toLowerCase();
  
      renameFile(path.join("images", `${req.session.email}_default${ext}`), path.join("images", `${ad_id}${ext}`));
      const imagePath = "../images/" + ad_id + ext;
  
      const newAdData = new AdModel({
        ad_id,
        ad_type,
        ad_category,
        ad_description,
        target_prints,
        ad_region,
        ad_type,
        ad_target_age,
        approval: "null",
        admin_feedback: "null",
        qr_link_id,
        customers: [],
        websiteUrl,
        prints: 0,
        ad_design: imagePath,
        payment_status: "0",
      });
      await newAdData.save();
      
      console.log(ad_target_age)
      mapOrders({
        ad_id,
        ad_target_age,
        ad_region,
        ad_category,
      });
      res.json({ success: true, message: 'Ad data uploaded successfully' });
    } 
    
    catch (error) 
    {
      console.error('Error uploading ad data:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/get-feedback', async (req, res) => {
    try {
      const userEmail = req.query.email;
      const feedback = await AdModel.find(
        { ad_id: { $regex: userEmail, $options: 'i' } },
        { ad_id: 1, admin_feedback: 1, approval: 1, _id: 0 } // Projection to include only ad_id and admin_feedback
      );
  
      if (feedback.length > 0)
        res.json({ success: true, ads: feedback });
      else 
        res.status(404).json({ success: false, message: "No feedback found for the provided email" });
    } 
    catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/user-ads-count', async (req, res) => {
    try {
      const userEmail = req.query.email
      
      // session check whether the requested user is the one logged in or not.
      if (!req.session.email || req.session.email !== userEmail) {
        res.json({ valid: false, message: "Unauthorized!" })
        return
      }
  
      // returns ads with ad_id with their email as prefix.
      const userAdCount = await AdModel.countDocuments({ ad_id: { $regex: `^${userEmail}_` } })
      res.json({ count: userAdCount });
    } 
    catch (error) {
      console.error('Error fetching ad count: ', error);
      res.status(500).json({ count: 0, error: 'Internal server error' })
    }
})

router.get('/retrieve-ads', async (req, res) => {

    // session check (only accessible to users on platform)
    if (!req.session.type) {
        res.json({ success: false, message: "Unauthorized!" })
        return
    }

    try {
        const approvalFlag = req.query.approval.toString();
        const paymentFlag = req.query.payment_status.toString();
        const email = req.session.email;

        let retrievedAds = []
        if (req.session.type === "admin" || req.session.type === "logistics") 
            retrievedAds = await AdModel.find({ approval: approvalFlag, payment_status: paymentFlag }).lean();

        else if (req.session.type === "advertiser")
            retrievedAds = await AdModel.find({ approval: approvalFlag, payment_status: paymentFlag, ad_id: { $regex: email, $options: 'i' }, }).lean();
    
        else
            retrievedAds = await AdModel.find().lean();
  
      res.json({ success: true, ads: retrievedAds });
    }
    catch (error) {
      console.error('Error fetching all ads:', error);
      res.json({ status: 500, success: false, message: error })
    }
})

router.post('/ad-approve/update', async (req, res) => {
    if (!req.session.type || req.session.type !== "admin") {
      res.json({ valid: false, message: "Unauthorized!" })
      return
    }
    try {
      const { ad_id, approval, payment_status, admin_feedback } = req.body;
  
      await AdModel.updateOne({ ad_id: ad_id }, { $set: { approval: approval } });
      await AdModel.updateOne({ ad_id: ad_id }, { $set: { admin_feedback: admin_feedback } })
      await AdModel.updateOne({ ad_id: ad_id }, { $set: { payment_status: payment_status } })
      // console.log({ ad_id: ad_id }, { $set: { approval: approval }}, {$set: {admin_feedback: admin_feedback}})
  
      res.json({ success: true, message: 'Ad approval status updated successfully' });
    } catch (error) {
      console.error('Error updating ad approval status:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;