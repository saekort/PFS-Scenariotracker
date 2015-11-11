<html>
<head>
</head>
<body>
	<h1>Admin</h1>
	
	<?php echo form_open(site_url('admin/index'));?>
	<h2>Add authors</h2>
	<p>Scenario: <?php echo form_dropdown('scenario', $scenarios, '');?></p>
	<p>Author(s): <?php echo form_multiselect('authors[]', $authors, '', 'size="20"');?></p>
	<input type="submit" value="Add authors to scenario">
	<?php echo form_close();?>
	
	<h1>New author</h1>
	<?php echo form_open(site_url('admin/index'));?>
	<p>New author name: <?php echo form_input('author');?>
	<input type="submit" value="Create new author">
	<?php echo form_close();?>
</body>
</html>