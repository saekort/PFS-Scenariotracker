<?php

/**
 * Character DataMapper Model
 *
 * Use this basic model as a character for creating new models.
 * It is not recommended that you include this file with your application,
 * especially if you use a Character library (as the classes may collide).
 *
 * To use:
 * 1) Copy this file to the lowercase name of your new model.
 * 2) Find-and-replace (case-sensitive) 'Character' with 'Your_model'
 * 3) Find-and-replace (case-sensitive) 'character' with 'your_model'
 * 4) Find-and-replace (case-sensitive) 'characters' with 'your_models'
 * 5) Edit the file as desired.
 *
 * @license		MIT License
 * @category	Models
 * @author		Phil DeJarnett
 * @link		http://www.overzealous.com
 */
class Character extends DataMapper {

	// Uncomment and edit these two if the class has a model name that
	//   doesn't convert properly using the inflector_helper.
	// var $model = 'character';
	// var $table = 'characters';

	// You can override the database connections with this option
	// var $db_params = 'db_config_name';

	// --------------------------------------------------------------------
	// Relationships
	//   Configure your relationships below
	// --------------------------------------------------------------------

	// Insert related models that Character can have just one of.
	var $has_one = array(
			'player' => array(
					'class' => 'person',
					'other_field' => 'characters',
					'join_self_as' => 'player'
			),
	);

	// Insert related models that Character can have more than one of.
	var $has_many = array();

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
    
    /**
     * (non-PHPdoc)
     * @see DataMapper::__toString()
     */
	public function __toString()
	{
		return (String)$this->name;
	}
}

/* End of file character.php */
/* Location: ./application/models/character.php */
