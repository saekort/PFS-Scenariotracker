<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * PFS sessiontracker API v1
 *
 * The first version of the PFS sessiontracker API
 *
 * @package		CodeIgniter
 * @subpackage	Rest Server
 * @category	Controller
 * @author		Simon Kort
*/

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class V1 extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        
        // Configure limits on our controller methods. Ensure
        // you have created the 'limits' table and enabled 'limits'
        // within application/config/rest.php
        $this->methods['user_get']['limit'] = 500; //500 requests per hour per user/key
        $this->methods['user_post']['limit'] = 100; //100 requests per hour per user/key
        $this->methods['user_delete']['limit'] = 50; //50 requests per hour per user/key
        
       	if($this->request->method == 'options')
       	{
       		$this->response('', 200);
       	}
    }
    
    function scenarios_get()
    {

    	
/**
 * THIS WORKS!
 
SELECT *
FROM `scenarios`
WHERE `scenarios`.`id` NOT IN(
    SELECT `scenarios`.`id`
    FROM `scenarios`
    LEFT OUTER JOIN `j_scenario_person`
        `players_j_scenario_person` ON `scenarios`.`id` = `players_j_scenario_person`.`scenario_id`
    WHERE
        `players_j_scenario_person`.`person_id` IN(1, 2, 3, 4, 5)    
    ) 
 
 
 */    	
    	
    	// Set a limit, could be expanded later on
    	$limit = 20;
    	
        $scenarios = new Scenario();
        
        // Always limit the amount of scenarios to a maximum of 20
        //$scenarios->limit(20);

        $i = 0;
        while($i < 2)
        {
	        // Filter: Season
	        if($this->get('season'))
	        {
	        	$scenarios->where_in('season', $this->get('season'));
	        }
	        
	        // Filter: Retired
	        if(!$this->get('retired'))
	        {
	        	$scenarios->where('archived IS NULL', NULL);
	        }
	        
	        // Filter: Search
	        if($this->get('search'))
	        {
	        	$scenarios->like('name', $this->get('search'));
	        }
	        
	        // Filter: Level range
	        if($this->get('levelRangeMin') && $this->get('levelRangeMax'))
	        {
	        	$scenarios->group_start();
	        	$levelrange = range($this->get('levelRangeMin'), $this->get('levelRangeMax'));
	        	
	        	foreach($levelrange as $key => $value)
	        	{
	        		$value = str_pad($value, 2, '0', STR_PAD_LEFT);
	        		$scenarios->or_like('levelrange', $value);
	        	}
	        	
	        	$scenarios->group_end();
	        }
	        
	        // Filter: Evergreen
	        if($this->get('evergreen'))
	        {
	        	$scenarios->where('evergreen', 1);
	        }
	        
	        // Filter: Players
	        if($this->get('player'))
	        {
	        	$pfsnumbers = array();
	        
	        	$subq_players = new Scenario();
	        	$subq_players->select('id')->where_in_related_players('pfsnumber', $this->get('player'));
	        	
	        	$scenarios->where_not_in_subquery('id', $subq_players);
	        }
	        
	    	// Pagination
	    	if($i == 0)
	    	{
	    		$scenarios->get();
	    		$response['count'] = $scenarios->result_count();
	    	}
	    	else
	    	{
	    		// First time through, just count
	    		if($this->get('currentPage'))
	    		{
	    			$page = $limit * ($this->get('currentPage') -1);
	    			$scenarios->limit($limit, $page);
	    		}
	    		else
	    		{
	    			// Just limit it to 20 scenarios
	    			$scenarios->limit($limit);
	    		}
	    		
	    		$scenarios->get();
	    	}
	    	
	    	$i++;
        }
        if($scenarios->exists())
        {
        	$scenarios_array = $scenarios->all_to_array();
        	
        	foreach($scenarios_array as $key => $value)
        	{
        		foreach($scenarios as $scenario)
        		{
        			if($scenario->id == $value['id'])
        			{
        				$scenarios_array[$key]['authors'] = $scenario->authors->all_to_single_array('name');
        				$scenarios_array[$key]['subtiers'] = $scenario->subtiers->all_to_single_array('name');        				
        			}
        		}
        	}
        	
        	$response['scenarios'] = $scenarios_array;
        	
            $this->response($response, 200); // 200 being the HTTP response code
        }
        else
        {
        	$response['scenarios'] = array();
        	$response['total'] = 0;
        	
            $this->response($response, 200);
        }   	
    }
    
    /**
     * Expects a filter JSON array URL encoded
     */
    function scenario_get()
    {
    	if(!$this->get('filters'))
    	{
    		$this->response(NULL, 400);
    	}
    	else
    	{
    		// Decode the filters
    	}
    	
        if(!$this->get('id'))
        {
        	$this->response(NULL, 400);
        }

		$scenario = new Scenario($this->get('id'));
    	
        if($scenario->exists())
        {
        	$scenario_array = $scenario->all_to_array();
        	
        	foreach($scenario_array as $key => $value)
        	{
        		$scenario_array[$key]['authors'] = $scenario->authors->all_to_single_array('name');
        		$scenario_array[$key]['subtiers'] = $scenario->subtiers->all_to_single_array('name');
        	}
        	
            $this->response($scenario_array, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Scenario could not be found'), 404);
        }
    }
    
    function people_get()
    {
    	if(!$this->get('search'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	$people = new Person();
    	$people->or_like('name', $this->get('search'));
    	$people->or_like('pfsnumber', $this->get('search'));
    	$people->get();
    
    	if($people->exists())
    	{
    		$people_array = $people->all_to_array();
    		 
    		$this->response($people_array, 200); // 200 being the HTTP response code
    	}
    	else
    	{
    		$this->response(array('error' => 'People could not be found'), 404);
    	}
    }
    
    function person_get()
    {
    	if(!$this->get('pfsnumber') && !$this->get('name'))
    	{
    		$this->response(NULL, 400);
    	}
    
    	$person = new Person();
    	
    	if($this->get('pfsnumber'))
    	{
    		// First try to get by unique pfsnumber
    		$person->get_by_pfsnumber($this->get('pfsnumber'));
    	}
    	else
    	{
    		// Otherwise try to get by name
    		$person->get_by_name($this->get('name'));
    	}
    	 
    	if($person->exists())
    	{
    		$person_array = $person->all_to_array();
    		    		 
    		$this->response($person_array, 200); // 200 being the HTTP response code
    	}
    	else
    	{
    		$this->response(array('error' => 'Person could not be found'), 404);
    	}
    }
    
    function person_post()
    {
    	if(!$this->post('pfsnumber') && !$this->post('name'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	$person = new Person();
    	
    	// Test to see if the pfsnumber is already in use
    	$person->get_by_pfsnumber($this->post('pfsnumber'));
    	
    	if($person->exists())
    	{
    		$this->response('Pfsnumber already registered', 400);
    	}
    	
    	$person->pfsnumber = $this->post('pfsnumber');
    	$person->name = $this->post('name');
    	
    	$person->save();
    	
    	$this->response($person->id, 200);
    }

    function reportscenarios_get()
    {
    	if(!$this->get('type') || !$this->get('pfsnumber'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	// Get the player
    	$player = new Person();
    	$player->get_by_pfsnumber($this->get('pfsnumber'));
    	
    	// Determine what kind of content we need to get
    	if($this->get('type') != 'overview')
    	{
    		// Normal content
    		if(is_numeric(substr($this->get('type'),1,1)))
    		{
    			
    			// Season
    			$season = substr($this->get('type'),1,1);
    			
    			// Get all the scenarios played for this player in this season
    			$played_scenarios = $player->scenarios->where('season', $season)->include_join_fields()->get();
    			
    			$state = array();

    			foreach($played_scenarios as $played_scenario)
    			{
    				$state[$played_scenario->id]['pfs'] = (bool)$played_scenario->join_pfs;
    				$state[$played_scenario->id]['core'] = (bool)$played_scenario->join_core;
    				$state[$played_scenario->id]['pfs_gm'] = (bool)$played_scenario->join_pfs_gm;
    				$state[$played_scenario->id]['core_gm'] = (bool)$played_scenario->join_pfs_gm;
    			}    			
    			
    			$scenarios = new Scenario();
    			$scenarios->get_by_season($season);
    			$scenarios_array = $scenarios->all_to_array();
    			
    			foreach($scenarios_array as $index => $scenario)
    			{
					if(array_key_exists($scenario['id'], $state))
					{
						$scenarios_array[$index]['state'] = $state[$scenario['id']];
					}
					else
					{
						$scenarios_array[$index]['state'] = array('pfs' => false, 'core' => false, 'pfs_gm' => false, 'core_gm' => false);
					}
    			}
    			
    			$this->response($scenarios_array, 200);
    		}
    		else
    		{
    			// Modules or adventure paths
    			//TODO
    			$this->response('Not yet implemented', 200);
    		}
    	}
    	else
    	{
    		// Generate overview
    		echo 'overview';
    	}
    }
    
    function reportscenario_post()
    {
    	if(!$this->post('state') || !$this->post('pfsnumber') || !$this->post('scenario'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	// Does a relationship exists yet?
    	$scenario = new Scenario($this->post('scenario'));
    	
    	$player = new Person();
    	$player->where('pfsnumber', $this->post('pfsnumber'))->where_related_scenarios($scenario)->get();
    	
    	if(!$player->exists())
    	{
    		$player->where('pfsnumber', $this->post('pfsnumber'))->get();
    		
    		// No relation yet!
    		$player->save_scenarios($scenario);
    	}
    	
    	$player->set_join_field($scenario, $this->post('state'), date("Y-m-d H:i:s"));
    	
    	$this->response('', 200);
    }
    
    function reportscenario_delete()
    {
    	if(!$this->delete('state') || !$this->delete('pfsnumber') || !$this->delete('scenario'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	// Does a relationship exists yet?
    	$scenario = new Scenario($this->delete('scenario'));
    	 
    	$player = new Person();
    	$player->where('pfsnumber', $this->delete('pfsnumber'))->where_related_scenarios($scenario)->get();
    	
    	$player->set_join_field($scenario, $this->delete('state'), NULL);
    	
    	// See if there is a relationship left or that we have to delete
    	$player
    		->where('pfsnumber', $this->delete('pfsnumber'))
    		->where_related_scenarios($scenario)
    		->where_join_field($scenario, 'pfs', NULL)
    		->where_join_field($scenario, 'pfs_gm', NULL)
    		->where_join_field($scenario, 'core', NULL)
    		->where_join_field($scenario, 'core_gm', NULL)
    		->get();
    	
    	if($player->exists())
    	{
    		// No more played things in the relationship, so delete
    		$player->delete_scenarios($scenario);
    	}
    	
    	$this->response('', 200);
    }    
    
    function playerprogress_get()
    {
    	if(!$this->get('pfsnumber'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	$scenario = new Scenario();
    	$scenario->select('season')->distinct()->get();
    	
    	$types = array();
    	
    	foreach($scenario as $s)
    	{
    		$types[] = $s->season;
    	}
    	
    	$response = array();
    	$playerprogress = new Person();
    	$scen = new Scenario();
    	
    	/*
SELECT count(*) as `numrows`
FROM `j_scenario_person`
LEFT OUTER JOIN `scenarios` ON `scenarios`.`id` = `j_scenario_person`.`scenario_id`
WHERE ( 
`j_scenario_person`.`pfs` IS NOT NULL
AND `scenarios`.`season` = '0'
 )
    	 */
    	
		$playerprogress->where('pfsnumber', $this->get('pfsnumber'))->get();
    	
    	foreach($scenario as $s)
    	{
    		$response[$s->season] = array('season' => $s->season, 'total' => 0, 'pfs' => 0, 'core' => 0, 'pfs_gm' => 0, 'core_gm' => 0);
    		
    		$response[$s->season]['pfs'] = $playerprogress->scenarios->where_join_field('players', 'pfs IS NOT NULL', NULL)->where('season', $s->season)->get()->result_count();
    		$response[$s->season]['core'] = $playerprogress->scenarios->where_join_field('players', 'core IS NOT NULL', NULL)->where('season', $s->season)->get()->result_count();;
    		$response[$s->season]['pfs_gm'] = $playerprogress->scenarios->where_join_field('players', 'pfs_gm IS NOT NULL', NULL)->where('season', $s->season)->get()->result_count();;
    		$response[$s->season]['core_gm'] = $playerprogress->scenarios->where_join_field('players', 'core_gm IS NOT NULL', NULL)->where('season', $s->season)->get()->result_count();;    		
    		$response[$s->season]['total'] = $scen->where('season', $s->season)->count();
    	}
    	
    	$this->response($response, 200);
    }
}