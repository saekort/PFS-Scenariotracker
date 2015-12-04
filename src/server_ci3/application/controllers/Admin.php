<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {

	/**
	 * Cron controller
	 */
	public function index()
	{
		if(isset($_POST['authors']))
		{
			print_r($_POST);
			$scenario = new Scenario($this->input->post('scenario'));
			
			$authors_ids = $this->input->post('authors');
			
			$authors = new Author();
			$authors->where_in('id', $authors_ids)->get();
			
			foreach($authors as $author)
			{
				echo 'adding '. $author . '<br>';
				$scenario->save_authors($author);
			}
		}
		elseif(isset($_POST['author']))
		{
			print_r($_POST);
			$author = new Author();
			$author->name = $_POST['author'];
			$author->save();
			
			echo 'Created author:' . $_POST['author'];
		}
		elseif(isset($_POST['storelink']))
		{
			print_r($_POST);
			$scenario = new Scenario($_POST['storelink_scenario']);
			$scenario->link = $_POST['storelink'];
			$scenario->save();
			
			echo 'Added storelink to: ' . $_POST['storelink_scenario'];
		}
		
		$data['scenarios'] = new Scenario();
		$data['scenarios']->where_related('authors', 'id IS NULL', null)->order_by('name', 'asc')->get();
		$data['scenarios'] = $data['scenarios']->all_to_single_array('name');

		$data['storelink_scenarios'] = new Scenario();
		$data['storelink_scenarios']->where('link IS NULL', null)->order_by('name', 'asc')->get();
		$data['storelink_scenarios'] = $data['storelink_scenarios']->all_to_single_array('name');		
		
		$data['authors'] = new Author();
		$data['authors']->order_by('name', 'asc')->get();
		$data['authors'] = $data['authors']->all_to_single_array('name');
		
		$this->load->helper('form');
		$this->load->view('admin', $data);
	}
}