const { validationResult } = require('express-validator');

const Proposal = require('../models/proposal');
const User = require('../models/user');
var AWS = require('aws-sdk');
var TurndownService = require('turndown');
var turndownService = new TurndownService();

exports.createProposal = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const organization = req.body.organization;
  const userId = req.body.userId;

  const proposal = new Proposal({
    title: title,
    organization: organization,
    creator: userId,
    content: ''
  });

  proposal
    .save()
    .then(proposal => {
      res.status(201).json({
        message: 'Proposal created successfully',
        proposal: proposal
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.saveProposal = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const proposalId = req.body.proposalId;
  const text = req.body.text;
  Proposal.findByIdAndUpdate(proposalId, { content: text }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

exports.getById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const proposalId = req.body.proposalId;
  Proposal.findById(proposalId, (err, proposal) => {
    if (err) {
      res.send(err);
    } else {
      if (proposal.content) {
        var markdownString = turndownService.turndown(proposal.content);
        proposal.content = markdownString;
      }
      res.send(proposal);
    }
  });
};

exports.attach = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const proposalId = req.body.proposalId;
  const file = req.file;
  const s3FileURL = process.env.AWS_UPLOADED_FILE_URL_LINK;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  s3bucket.upload(params, function(err, data) {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      res.send({ data });
      var newFileUploaded = {
        description: req.body.description,
        fileLink: s3FileURL + file.originalname,
        s3_key: params.Key
      };
      Proposal.updateOne(
        { _id: proposalId },
        { $push: { attachments: newFileUploaded } }
      ).then(proposal => {
        console.log(proposal);
      });
    }
  });
};

exports.getByUserid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const userId = req.body.userId;

  Proposal.find({ creator: userId }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
