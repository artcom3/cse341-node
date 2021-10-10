const express = require('express');
const router = express.Router();
const p08Controller = require('../controllers/p08.js');

router.get('/', p08Controller.getProducts);
router.get('/search', p08Controller.getSearchProducts);

module.exports = router;