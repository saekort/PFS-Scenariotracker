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
    	// Set a limit, could be expanded later on
    	$limit = 15;
    	
        $scenarios = new Scenario();

        $i = 0;
        while($i < 2)
        {
        	if($this->get('scenarios') || $this->get('modules') || $this->get('aps') || $this->get('quests'))
        	{
        		$scenarios->group_start();
        	}
        	
        	// Filter: Scenarios
        	if($this->get('scenarios'))
        	{
        		$scenarios->or_where('type', 'scenario');
        	}
        	
        	// Filter: Modules
        	if($this->get('modules'))
        	{
        		$scenarios->or_where('type', 'mod');
        	}

        	// Filter: Adventure paths
        	if($this->get('aps'))
        	{
        		$scenarios->or_where('type', 'ap');
        	}
        	
        	// Filter: Quests
        	if($this->get('quests'))
        	{
        		$scenarios->or_where('type', 'quest');
        	}   	

        	if($this->get('scenarios') || $this->get('modules') || $this->get('aps') || $this->get('quests'))
        	{
        		$scenarios->group_end();
        	}
        	
        	if(!$this->get('scenarios') && !$this->get('modules') && !$this->get('aps') && !$this->get('quests'))
        	{
        		// Dirty, but works
        		$scenarios->where('type', 'nonexistent');
        	}
        	
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
	        
	        // Filter: Specials
	        if(!$this->get('specials'))
	        {
	        	$scenarios->not_like('name', '%Special: %');
	        }	        
	        
	        // Filter: Search
	        if($this->get('search'))
	        {
	        	$scenarios->like('name', $this->get('search'));
	        }
	        
	        // Filter: Author
	        if($this->get('author'))
	        {
	        	$scenarios->like_related_authors('name', $this->get('author'))->distinct();
	        }
	        
	        // Filter: Level range
	        if($this->get('levels'))
	        {
	        	$levels = $this->get('levels');
	        	foreach($levels as $level)
	        	{
	        		$scenarios->like('levelrange', $level);
	        	}
	        }
	        
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
	        if($this->get('player') && $this->get('campaign'))
	        {
	        	$pfsnumbers = array();
	        
	        	$subq_players = new Scenario();
	        	$subq_players->select('id')->where_join_field('players', $this->get('campaign') . ' IS NOT NULL', null)->where_in_related_players('pfsnumber', $this->get('player'));
	        	
	        	$scenarios->where_not_in_subquery('id', $subq_players);
	        }
	        
	        // Sorting
	        if($this->get('sorting'))
	        {
	        	if($this->get('sorting') == 'name_asc')
	        	{
	        		$scenarios->order_by('name', 'asc');
	        	}
	        	elseif($this->get('sorting') == 'name_desc')
	        	{
	        		$scenarios->order_by('name', 'desc');
	        	}
	        	elseif($this->get('sorting') == 'season_asc')
	        	{
	        		$scenarios->order_by('season', 'asc');
	        		$scenarios->order_by('cast(number as unsigned)', 'asc');
	        		$scenarios->order_by('name', 'asc');
	        	}
	        	elseif($this->get('sorting') == 'season_desc')
	        	{
	        		$scenarios->order_by('season', 'desc');
	        		$scenarios->order_by('cast(number as unsigned)', 'desc');
	        		$scenarios->order_by('name', 'desc');
	        	}
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
	    			// Just limit it to X scenarios
	    			$scenarios->limit($limit);
	    		}
	    		
	    		$scenarios->get();
	    		//$scenarios->check_last_query();
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
    	$people->order_by('name','asc');
    	$people->limit(5);
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
    	if(!$this->post('pfsnumber') && !$this->post('name') && !$this->post('password') && !$this->post('public') && !$this->post('email'))
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
    	
    	$person->get_by_email($this->post('email'));
    	if($person->exists())
    	{
    		$this->response('E-mail already registered', 400);
    	}    	
    	
    	$this->load->library('ion_auth');

    	$extra = array(
    				'pfsnumber' => $this->post('pfsnumber'),
    				'public' => $this->post('public'),
    				'name' => $this->post('name')
    			);
    	
    	$this->response($this->ion_auth->register($this->post('name'), $this->post('password'), $this->post('email'), $extra, 200));
    }
    
    function person_login_get()
    {
    	if(!$this->get('login') && !$this->get('password'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	$this->session->set_userdata('player_id', 1);
    	
    	$this->response($this->session->played_id, 200);
    }
    
    function person_logout_get()
    {
    	// Kill the current user session
    	session_destroy();
    }
    
    function authors_get()
    {
    	if(!$this->get('search'))
    	{
    		$this->response(NULL, 400);
    	}
    	 
    	$authors = new Author();
    	$authors->like('name', $this->get('search'));
    	$authors->order_by('name','asc');
    	$authors->limit(5);
    	$authors->get();
    
    	if($authors->exists())
    	{
    		foreach($authors as $author)
    		{
    			$authors_array[] = $author->name;
    		}
    		
    		 
    		$this->response($authors_array, 200); // 200 being the HTTP response code
    	}
    	else
    	{
    		$this->response(array('error' => 'Authors could not be found'), 404);
    	}
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
    		} 
    		else 
    		{
    			// Module or Adventure path
    			$content = $this->get('type');
    			
    			// Get all the modules and adventure paths played for this player
    			$played_scenarios = $player->scenarios->where('type', $content)->include_join_fields()->get();    			
    		}
    		
    			$state = array();

    			foreach($played_scenarios as $played_scenario)
    			{
    				$state[$played_scenario->id]['pfs'] = (bool)$played_scenario->join_pfs;
    				$state[$played_scenario->id]['core'] = (bool)$played_scenario->join_core;
    				$state[$played_scenario->id]['pfs_gm'] = (bool)$played_scenario->join_pfs_gm;
    				$state[$played_scenario->id]['core_gm'] = (bool)$played_scenario->join_core_gm;
    			}    			
    			
    			$scenarios = new Scenario();
				if(is_numeric(substr($this->get('type'),1,1)))
				{
					$scenarios->order_by('cast(number as unsigned)', 'asc')->get_by_season($season);
				}
				else
				{
					$scenarios->order_by('name', 'asc')->get_by_type($content);
				}
				
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
    	if(!$this->get('pfsnumber') || !$this->get('type'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	$scenario = new Scenario();

    	$scenario->select('season, type')->distinct()->get();

    	$types = array();
    	
    	foreach($scenario as $s)
    	{
    		$types[] = $s->season;
    	}
    	
    	$types[] = 'mod';
    	$types[] = 'ap';
    	
    	$response = array();
    	$playerprogress = new Person();
    	$scen = new Scenario();

		$playerprogress->where('pfsnumber', $this->get('pfsnumber'))->get();
    	
    	foreach($scenario as $s)
    	{
    		if($s->type == 'mod')
    		{
    			// Modules
				$response['mod'] = array('season' => 'Modules', 'total' => 0, 'completed' => 0);
				$response['mod']['completed'] = $playerprogress->scenarios->where_join_field('players', $this->get('type') . ' IS NOT NULL', NULL)->where('type', 'mod')->where('archived IS NULL', NULL)->get()->result_count();
				$response['mod']['total'] = $scen->where('type', 'mod')->where('archived IS NULL', NULL)->count();				
    		}
    		elseif($s->type == 'ap')
    		{
    			// Adventure paths
    			$response['ap'] = array('season' => 'APs', 'total' => 0, 'completed' => 0);
    			$response['ap']['completed'] = $playerprogress->scenarios->where_join_field('players', $this->get('type') . ' IS NOT NULL', NULL)->where('type', 'ap')->where('archived IS NULL', NULL)->get()->result_count();
    			$response['ap']['total'] = $scen->where('type', 'ap')->where('archived IS NULL', NULL)->count();
    		}
    		else
    		{
    			// Seasons
    			$response[$s->season] = array('season' => $s->season, 'total' => 0, 'completed' => 0, 'contenttype' => $s->type);
    			$response[$s->season]['completed'] = $playerprogress->scenarios->where_join_field('players', $this->get('type') . ' IS NOT NULL', NULL)->where('season', $s->season)->where('archived IS NULL', NULL)->get()->result_count();
    			$response[$s->season]['total'] = $scen->where('season', $s->season)->where('archived IS NULL', NULL)->count();
    		}
    	}
    	
    	$this->response($response, 200);
    }
    
    function statistics_get()
    {
    	if(!$this->get('type'))
    	{
    		$this->response(NULL, 400);
    	}
    	
    	$statistics = new Statistic();
    	$statistics->order_by('number', 'asc')->get_by_type($this->get('type'));
    	
    	$scenario_options = array('played_most', 'played_least', 'season', 'evergreen');
    	$person_options = array('player_complete_pfs', 'player_complete_core', 'gm_complete_pfs', 'gm_complete_core');
    	
    	$result = array();
    	
    	foreach($statistics as $statistic)
    	{
    		$result[$statistic->id] = $statistic->to_array();
    		
    		if(in_array($this->get('type'), $person_options))
    		{
    			$result[$statistic->id]['person'] = $statistic->person->to_array();
    		}
    		else
    		{
				$result[$statistic->id]['scenario'] = $statistic->scenario->to_array();
    		}
    	}
    	
    	$this->response($result, 200);
    }
}