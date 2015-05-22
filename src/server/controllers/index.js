var models = require('../models');
var express = require('express');
var router = express.Router();

router.use('/persons', require('./persons.js'));
router.use('/scenarios', require('./scenarios.js'));

/* GET home page */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'The PFS Sessiontracker API' });
});

/* POST home page */
router.post('/', function(req, res, next) {
	res.send('POST request to the homepage');
});

module.exports = router;