var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET authors listing */
router.get('/', function(req, res, next) {
	models.Author.all().then(function(authors) {
		for(var i = 0; i < authors.length; ++i)
		{
			console.log(authors[i].name);
		}
		res.send(authors);
	});
});

router.get('/:author_id', function(req, res, next) {
	models.Author.find({
		where: {id: req.params.author_id}
	}).then(function(author) {
		author.getScenarios().then(function(scenarios)
		{
			res.send(author);
		});
	});
});

module.exports = router;