<?php

/**
 * Statistic DataMapper Model
 *
 * @license		MIT License
 * @category	Models
 * @statistic		Simon Kort
 */
class Statistic extends DataMapper {

	// Uncomment and edit these two if the class has a model name that
	//   doesn't convert properly using the inflector_helper.
	// var $model = 'statistic';
	var $table = 'statistics';

	// You can override the database connections with this option
	// var $db_params = 'db_config_name';

	// --------------------------------------------------------------------
	// Relationships
	//   Configure your relationships below
	// --------------------------------------------------------------------

	// Insert related models that Statistic can have just one of.
	var $has_one = array(
			'scenario' => array(
					'class' => 'scenario',
					'other_field' => 'statistics'
					),
			'person' => array(
					'class' => 'person',
					'other_field' => 'statistics'
					)
			);

	// Insert related models that Statistic can have more than one of.
	var $has_many = array();

	/* Relationship Examples
	 * For normal relationships, simply add the model name to the array:
	 *   $has_one = array('user'); // Statistic has one User
	 *
	 * For complex relationships, such as having a Creator and Editor for
	 * Statistic, use this form:
	 *   $has_one = array(
	 *   	'creator' => array(
	 *   		'class' => 'user',
	 *   		'other_field' => 'created_statistic'
	 *   	)
	 *   );
	 *
	 * Don't forget to add 'created_statistic' to User, with class set to
	 * 'statistic', and the other_field set to 'creator'!
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
	// Custom Methods
	//   Add your own custom methods here to enhance the model.
	// --------------------------------------------------------------------

    /**
     * (non-PHPdoc)
     * @see DataMapper::__toString()
     */
	public function __toString()
	{
		return $this->id;
	}
	
	public function generate_all()
	{
		$types = array('played_most', 'played_least', 'evergreen', 'player_complete_pfs', 'gm_complete_pfs', 'player_complete_core', 'gm_complete_core');
		
		foreach($types as $type)
		{
			echo 'Generating: ' . $type. '<br>';
			$this->generate($type);
		}
	}
	
	public function generate($type=0)
	{
		$scenario_options = array('played_most', 'played_least', 'season', 'evergreen');
		$person_options = array('player_complete_pfs', 'player_complete_core', 'gm_complete_pfs', 'gm_complete_core');

		if(in_array($type, $scenario_options))
		{
			// This is a scenario based statistic
			$scenarios = new Scenario();
			$scenarios->where('archived IS NULL', NULL);
			
			if($type == 'evergreen')
			{
				$scenarios->where('evergreen', '1');
			}
			
			$scenarios->get();
			
			$options = array();
			
			foreach($scenarios as $scenario)
			{
				$options[$scenario->id] = $scenario->players->count();
			}
			
			// Sort
			if($type == 'played_least')
			{
				asort($options);
			}
			else
			{
				arsort($options);
			}
			
			// Select only top 5
			$options = array_slice($options, 0, 10, true);
			
			// Delete old data
			$this->where('type', $type)->get()->delete_all();
			
			$number = 1;
			
			foreach($options as $key => $option)
			{
				$this->clear();
				$this->type = $type;
				$this->number = $number;
				$this->scenario_id = $key;
				$this->comment = $option;
				$this->save();
				$number++;
			}
		}
		else
		{
			// This is a person based statistic
			$people = new Person();
			$people->get();
			
			$number = 1;
			
			$options = array();
				
			foreach($people as $person)
			{
				if($type == 'player_complete_pfs')
				{
					$scenarios = $person->scenarios->where_join_field('players', 'pfs IS NOT NULL', NULL, FALSE)->where('archived IS NULL', NULL)->get();
					$options[$person->id] = $scenarios->result_count();
				}
				elseif($type == 'gm_complete_pfs')
				{
					$scenarios = $person->scenarios->where_join_field('players', 'pfs_gm IS NOT NULL', NULL, FALSE)->where('archived IS NULL', NULL)->get();
					$options[$person->id] = $scenarios->result_count();
				}
				elseif($type == 'player_complete_core')
				{
					$scenarios = $person->scenarios->where_join_field('players', 'core IS NOT NULL', NULL, FALSE)->where('archived IS NULL', NULL)->get();
					$options[$person->id] = $scenarios->result_count();
				}
				elseif($type == 'gm_complete_core')
				{
					$scenarios = $person->scenarios->where_join_field('players', 'core_gm IS NOT NULL', NULL, FALSE)->where('archived IS NULL', NULL)->get();
					$options[$person->id] = $scenarios->result_count();
				}								
				
			}			
			
			// Sort
			arsort($options);		
			
			// Select only top 5
			$options = array_slice($options, 0, 10, true);
				
			// Delete old data
			$this->where('type', $type)->get()->delete_all();			
			
			// Get total amount of scenarios
			$scenarios = new Scenario();
			$total = $scenarios->where('archived IS NULL', NULL)->count();
			
			foreach($options as $key => $option)
			{
				$this->clear();
				$this->type = $type;
				$this->number = $number;
				$this->person_id = $key;
				$this->comment = $option . '/' . $total;
				$this->save();
				$number++;
			}			
		}

		return TRUE;		
	}
}

/* End of file statistic.php */
/* Location: ./application/models/statistic.php */