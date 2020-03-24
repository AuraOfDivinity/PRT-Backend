const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the schema for the Post object. Setting the timestamp key to true will change cerate a new timestamp whenever a new object is added to the database.
const proposalSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: true
    },
    content: {
      type: String
    }
    // creator: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // }
  },
  { timestamps: true }
);

// We export a model created using the schema we just created.
module.exports = mongoose.model('Proposal', proposalSchema);
