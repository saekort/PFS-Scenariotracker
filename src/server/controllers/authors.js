var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET authors listing */
router.get('/', function(req, res, next) {
	models.Author.all().then(function(authors) {
		res.send(authors);
	});
});

module.exports = router;