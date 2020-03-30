const express = require('express');
const { body } = require('express-validator');
const proposalController = require('../controllers/proposal');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// POST /proposal/createproposal
router.post('/create', isAuth, proposalController.createProposal);

// POST /proposal/saveproposal
router.post('/save', isAuth, proposalController.saveProposal);

router.post('/getbyid', isAuth, proposalController.getById);

// POST /proposal/attach
router.post(
  '/attach',
  isAuth,
  // Adding in simple server side validation
  [
    body('proposalId')
      .trim()
      .isLength({ min: 1 })
  ],
  proposalController.attach
);

router.post('/getbyuserid', isAuth, proposalController.getByUserid);

router.post(
  '/updatestatus/:proposalId',
  isAuth,
  proposalController.updateStatus
);

router.delete('/delete/:proposalId', isAuth, proposalController.deleteProposal);

module.exports = router;
