const { validationResult } = require('express-validator');

const Proposal = require('../models/proposal');
const User = require('../models/user');

exports.createProposal = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const organization = req.body.organization;

  const proposal = new Proposal({
    title: title,
    organization: organization
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

  console.log(req.body.text);
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
