const mongoose = require('mongoose');

const ad_database_schema = new mongoose.Schema({
    ad_id: {
      type: String,
      unique: true,
    },
    ad_type: String,
    ad_category: String,
    ad_design: String,
    ad_description: String,
    ad_region: String,
    ad_type: String,
    ad_target_age: String,
    target_prints: String,
    approval: String, // "null"-> Pending 1-> Approved 0-> Declined
    admin_feedback: String,
    qr_link_id:
    {
      type: String,
      unique: true,
    },
    customers: [{}],
    prints: Number,
    websiteUrl: String,
    payment_status: String, // 0->Pending 1->Approved
});

const AdModel = mongoose.model('ad_database', ad_database_schema);
module.exports = AdModel;