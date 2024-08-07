const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
    {
      personal_info:
      {
        type: Object,
        default: {}
      },
      categorize:
      {
        type: Object,
        default: {}
      },
      timestamp: String,
      orderId: String,
      product_type: String,
      product_category: String,
      mapped_ads: [{ type: String }],
      customer_email: String,
  
      // - status: Status (”ready-to-print”, “in-print”, “ready-to-dispatch”, “dispatched”)
      status: String,
    }
)

const Response = mongoose.model('Response', responseSchema)
module.exports = Response;