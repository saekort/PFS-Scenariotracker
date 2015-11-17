<?php

/**
 * Subtier DataMapper Model
 *
 * @license		MIT License
 * @category	Models
 * @author		Simon Kort
 */
class Person extends DataMapper {

	// Uncomment and edit these two if the class has a model name that
	//   doesn't convert properly using the inflector_helper.
	// var $model = 'subtier';
	var $table = 'people';

	// You can override the database connections with this option
	// var $db_params = 'db_config_name';

	// --------------------------------------------------------------------
	// Relationships
	//   Configure your relationships below
	// --------------------------------------------------------------------

	// Insert related models that Subtier can have just one of.
	var $has_one = array();

	// Insert related models that Subtier can have more than one of.
	var $has_many = array(
			'scenarios' => array(
					'class' => 'scenario',
					'other_field' => 'players',
					'join_self_as' => 'person',
					'join_other_as' => 'scenario',
					'join_table' => 'j_scenario_person'
			),
			'statistics' => array(
					'class' => 'statistic',
					'other_field' => 'person'
			),
			'characters' => array(
					'class' => 'character',
					'other_field' => 'player'
			)			
		);

	/* Relationship Examples
	 * For normal relationships, simply add the model name to the array:
	 *   $has_one = array('user'); // Subtier has one User
	 *
	 * For complex relationships, such as having a Creator and Editor for
	 * Subtier, use this form:
	 *   $has_one = array(
	 *   	'creator' => array(
	 *   		'class' => 'user',
	 *   		'other_field' => 'created_subtier'
	 *   	)
	 *   );
	 *
	 * Don't forget to add 'created_subtier' to User, with class set to
	 * 'subtier', and the other_field set to 'creator'!
	 *
	 */

	// --------------------------------------------------------------------
	// Validation
	//   Add validation requirements, such as 'required', for your fields.
	// --------------------------------------------------------------------

	var $validation = array();

	// --------------------------------------------------------------------
	// Default Ordering
	//   Uncomment this to always sort by 'name', then by
	//   id descending (unless overridden)
	// --------------------------------------------------------------------

	// var $default_order_by = array('name', 'id' => 'desc');

	// --------------------------------------------------------------------

	/**
	 * Constructor: calls parent constructor
	 */
    function __construct($id = NULL)
	{
		parent::__construct($id);
    }

	// --------------------------------------------------------------------
	// Post Model Initialisation
	//   Add your own custom initialisation code to the Model
	// The parameter indicates if the current config was loaded from cache or not
	// --------------------------------------------------------------------
	function post_model_init($from_cache = FALSE)
	{
	}

	// --------------------------------------------------------------------
	// Custom Methods
	//   Add your own custom methods here to enhance the model.
	// --------------------------------------------------------------------

    /**
     * (non-PHPdoc)
     * @see DataMapper::__toString()
     */
	public function __toString()
	{
		return (String)$this->name;
	}

	// --------------------------------------------------------------------
	// Custom Validation Rules
	//   Add custom validation rules for this model here.
	// --------------------------------------------------------------------

	/* Example Rule
	function _convert_written_numbers($field, $parameter)
	{
	 	$nums = array('one' => 1, 'two' => 2, 'three' => 3);
	 	if(in_array($this->{$field}, $nums))
		{
			$this->{$field} = $nums[$this->{$field}];
	 	}
	}
	*/
}

/* End of file subtier.php */
/* Location: ./application/models/subtier.php */

