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
        $scenarios = new Scenario();
        
        // Always limit the amount of scenarios to a maximum of 20
        //$scenarios->limit(20);

        // Filter: Season
        if($this->get('season'))
        {
        	$scenarios->where_in('season', $this->get('season'));
        }
        
        // Filter: Level range
        if($this->get('levelRangeMin') && $this->get('levelRangeMax'))
        {
        	//TODO
        }
        
    	$scenarios->get();
    	 
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
        	
            $this->response($scenarios_array, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(array('error' => 'Scenarios could not be found'), 404);
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
}