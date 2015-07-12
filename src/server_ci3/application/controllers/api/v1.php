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

    function scenarioBySeason_get()
    {
        if(!$this->get('season'))
        {
            $this->response(NULL, 400);
        }

        $scenario = new Scenario();
        $scenario->get_by_season($this->get('season'));

        if($scenario->exists())
        {
            $scenario_array = $scenario->all_to_array();
                         
            $this->response($scenario_array, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Person could not be found'), 404);
        }        
    }
}