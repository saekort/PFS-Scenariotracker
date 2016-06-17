var express = require('express');
var passport = require('passport');
var models = require("../models");
var router = express.Router();

/**
 * @api {get} /authors GET a group of authors
 * @apiName GetAuthors
 * @apiGroup Author
 * 
 * @apiParam {Number} rows Maximum number of authors to return. Max 20.
 * @apiParam {Number} page Page to return based on the rows.
 * @apiParam {String} [search] Search string to limit the result to. Will search in author <code>name</code> only. (NYI)
 * @apiParam {String="name"} [orderBy] By what returned field to order by. Defaults to <code>name</code>. (NYI)
 * @apiParam {String="ASC","DESC"} [order] How to order the return set. Defaults to <code>ASC</code>. (NYI)
 * 
 * @apiSuccess {Number} count The total number of authors in the system
 * @apiSuccess {Object[]} rows List of Authors (Array of Objects).
 * @apiSuccess {String} rows.id ID of the Author.
 * @apiSuccess {String} rows.name Name of the Author.
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "count":122,
 *  "rows":[
 *     {
 *        "id":31,
 *        "name":"Adam Daigle",
 *     },
 *     {
 *        "id":40,
 *        "name":"Alex Greenshields",
 *     }
 * 	]
 * }
 * 
 * @apiError {400} BadRequest The request was not in a valid format.
 * @apiErrorExample {400} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "BadRequest"
 *     }
 * 
 * @apiError {401} Unauthorized You are not allowed access Authors.
 * @apiErrorExample {401} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized"
 *     } 
 */
router.get('/', function(req, res, next) {
	if(req.query.rows && req.query.page && req.query.rows <= 20)
	{
		var findParams = {};
		findParams.where = {};		
		
		// Handle 'rows' & 'page'
		if(typeof req.query.rows !== 'undefined' || typeof req.query.rows !== 'undefined') {
			if(req.query.rows > 0 && req.query.rows <= 20 && req.query.page > 0) {
				findParams.limit = parseInt(req.query.rows);
				findParams.offset = parseInt(req.query.page * req.query.rows - req.query.rows);
			} else {
				res.status(400).end();
			}
		} else {
			res.status(400).end();
		}
		
		// Handle 'search'
		if(typeof req.query.search !== 'undefined' && req.query.search !== '') {
			findParams.where.name = {$like: '%' + req.query.search + '%'};
		}
		
		// Handle 'orderBy' & 'order'
		var orderBy = 'name';
		var order = 'ASC';
		if(typeof req.query.orderBy !== 'undefined' && typeof req.query.order != 'undefined') {
			if(req.query.orderBy === 'name') {
				// Only allow 'name'
				orderBy = req.query.orderBy; 
			}
			
			if(req.query.order.toUpperCase() === 'ASC' || req.query.order.toUpperCase() === 'DESC') {
				// Only allow 'ASC' or 'DESC'
				order = req.query.order;
			}
			
			findParams.order = [ [ orderBy, order ] ];
		}
		
		models.Author.findAndCountAll(findParams)
		.then(function (authors) {
			res.status(200).send(authors);
		}).catch(function(error) {
			res.status(400).end();
		});
	}
	else
	{
		res.status(400).end();
	}
});

/**
 * @api {get} /authors/:id GET an author
 * @apiName GetAuthor
 * @apiGroup Author
 * 
 * @apiParam {Number} id Author's unique ID.
 * 
 * @apiError {400} BadRequest The request was not in a valid format.
 * @apiError {404} AuthorNotFound The <code>id</code> of the Author was not found.
 * @apiError {401} Unauthorized You are not allowed access to the Author. 
 */
router.get('/:id', function(req, res, next) {
	if(req.params.id)
	{	
		models.Authors.findById(req.params.id)
		.then(function(authors) {
			res.status(200).send(authors);
		}).catch(function(error) {
			res.status(400).send(error);
		});
	}
	else
	{
		res.status(400).end();
	}
});

/**
 * @api {post} /authors/ CREATE an author
 * @apiName CreateAuthor
 * @apiGroup Author
 * 
 * @apiHeader {String} Authorization The authorization token.
 * 
 */

/**
 * @api {put} /authors/:id UPDATE an author
 * @apiName UpdateAuthor
 * @apiGroup Author
 *
 * @apiHeader {String} Authorization The authorization token.
 *
 * @apiParam {Number} id Author's unique ID.
 */

/**
 * @api {delete} /authors/:id DELETE an author
 * @apiName DeleteAuthor
 * @apiGroup Author
 *
 * @apiHeader {String} Authorization The authorization token.
 *
 * @apiParam {Number} id Author's unique ID.
 */

module.exports = router;
