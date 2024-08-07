const mongoose = require("mongoose");

const queSchema = new mongoose.Schema(
    {
      que_type: String,
      que:
      {
        type: String,
        unique: true,
      },
      mandatory: Boolean,
      options: [{ type: String }],
      categorize: Boolean,
      jsonName: String,
    }
)

queSchema.pre('save', async function(next) {
// Check if the document is new (i.e., being created)
    if (this.isNew) {
        
        // if the jsonName is empty, then, we will update it with its id.
        if(this.jsonName == "")
        this.jsonName = this._id;
    }
    // Continue with the save operation
    next();
});

const Que = mongoose.model('questions', queSchema)
module.exports = Que;