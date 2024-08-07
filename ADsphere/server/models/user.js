const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    repName: String,
    email: {
      type: String,
      unique: true
    },
    web: String,
    orgName: String,
    type: String, // admin, advertiser, logistics
    options:
    {
      type: Object,
      default: {}
    },
    password: String
})

const User = mongoose.model('Users', userSchema);
module.exports = User;