<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cron extends CI_Controller {

	/**
	 * Cron controller
	 */
	public function index($type=0)
	{
		$statistics = new Statistic();
	
		if($type)
		{
			// Try to run a statistic with given type
			$statistics->generate($type);
		}
		else
		{
			// Run all statistics
			$statistics->generate_all();
		}
	}
}
