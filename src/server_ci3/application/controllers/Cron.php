<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cron extends CI_Controller {

	/**
	 * Cron controller
	 */
	public function index()
	{
		$statistics = new Statistic();
		$statistics->generate_all();
	}
}
