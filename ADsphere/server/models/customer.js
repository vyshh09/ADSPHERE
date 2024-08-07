const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
      email:
      {
        type: String,
        unique: true,
      },
      personal_info:
      {
        type: Object,
        default: {}
      },
      categories: [{type: String}],
      category_scores: [{type: Number}],
  
      // Interactions with ads of an Advertiser
      advInteracted: [{type: String}],
      questions: [{type: String}],
    }
)

const Customer = mongoose.model('customers', customerSchema)
module.exports = Customer;