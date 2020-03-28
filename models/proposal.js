const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    },
    proposalStatus: {
      type: String,
      required: true,
      default: 'draft'
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    attachments: [{ description: String, fileLink: String, s3_key: String }]
  },
  { timestamps: true }
);

// We export a model created using the schema we just created.
module.exports = mongoose.model('Proposal', proposalSchema);
