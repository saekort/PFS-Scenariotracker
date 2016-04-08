var express = require('express');
var models = require("../models");
var router = express.Router();

/**
 * @api {get} /authors GET a group of authors
 * @apiName GetAuthors
 * @apiGroup Author
 * 
 * @apiHeader {String} Authorization The authorization token.
 * 
 * @apiParam {Number} rows Maximum number of authors to return. This is limited to a max of 20.
 * @apiParam {Number} page Page to return based on the rows.
 * @apiParam {String} [search] Search string to limit the result to. Will search in author 'name' only. (NYI)
 * @apiParam {String="name", "id"} [orderBy] By what returned field to order by. Defaults to 'name'. (NYI)
 * @apiParam {String="ASC","DESC"} [order] How to order the return set. Defaults to 'ASC'. (NYI)
 * 
 * @apiSuccess {Number} count The total authors in the system
 * @apiSuccess {Object[]} rows List of Authors (Array of Objects).
 * @apiSuccess {String} rows.id ID of the Author.
 * @apiSuccess {String} rows.name Name of the Author.
 * @apiSuccess {String} rows.created_on The date on which the Author was created.
 * @apiSuccess {String} rows.updated_on The date on which the Author was last updated.
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "count":122,
 *  "rows":[
 *     {
 *        "id":31,
 *        "name":"Adam Daigle",
 *        "created_on":"2015-07-04T00:00:00.000Z",
 *        "updated_on":"2015-07-04T00:00:00.000Z"
 *     },
 *     {
 *        "id":40,
 *        "name":"Alex Greenshields",
 *        "created_on":"2015-07-04T00:00:00.000Z",
 *        "updated_on":"2015-07-04T00:00:00.000Z"
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
		models.Authors.findAndCountAll({
			limit: parseInt(req.query.rows),			
			offset: parseInt(req.query.page * req.query.rows - req.query.rows),			
			order: '`name` ASC'
		}).then(function (authors) {
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
 * @apiHeader {String} Authorization The authorization token.
 * 
 * @apiParam {Number} id Author's unique ID.
 * 
 * @apiError {400} BadRequest The request was not in a valid format.
 * @apiError {404} AuthorNotFound The <code>id</code> of the Author was not found.
 * @apiError {401} Unauthorized You are not allowed access to the Author. 
 */
router.get('/', function(req, res, next) {
	models.Authors.findAndCountAll()
	.then(function(authors) {
		res.status(200).send(authors);
	}).catch(function(error) {
		res.status(400).send(error);
	});
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
