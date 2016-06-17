var express = require('express');
var models = require("../models");
var router = express.Router();

/**
 * @api {get} /statistics/:type GET a statistic
 * @apiName GetStatistic
 * @apiGroup Statistic
 * 
 * @apiParam {String="totals", "played_most", "evergreen", "player_complete_pfs", "gm_complete_pfs", "player_complete_core", "gm_complete_core"} type What statistic to get.
 * 
 * @apiError {400} BadRequest The request was not in a valid format.
 * @apiError {401} Unauthorized You are not allowed access to the Statistic. 
 */
router.get('/', function(req, res, next) {
	// All allowed statistic types
	var types = [
	             'totals',
	             'played_most',
	             'evergreen',
	             'player_complete_pfs',
	             'gm_complete_pfs',
	             'player_complete_core',
	             'gm_complete_core'
	             ];
	
	if(typeof req.query.type != undefined && types.indexOf(req.query.type) > -1)
	{	
		models.Statistic.findAll({
			where: {type: req.query.type},
			include: [ {model: models.Scenario, as: 'scenario'},
			           {model: models.Person, as: 'person'} ],
		}).then(function(statistics) {
			res.status(200).send(statistics);
		}).catch(function(error) {
			console.log(error);
			res.status(400).send(error);
		});
	}
	else
	{
		res.status(400).end();
	}
});

module.exports = router;