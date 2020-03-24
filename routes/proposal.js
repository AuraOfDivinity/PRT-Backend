const express = require('express');
const { body } = require('express-validator');

const proposalController = require('../controllers/proposal');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /proposal/createproposal
router.post('/create', isAuth, proposalController.createProposal);

router.post('/save', isAuth, proposalController.saveProposal);

module.exports = router;
