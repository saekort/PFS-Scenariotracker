<html>
<body>
	<h1><?php echo sprintf(lang('email_forgot_password_heading'), $identity);?></h1>
	<p>We got a request to reset your password for the Pathfinder Society sessiontracker. If that was not you, you can ignore this email. If it was you, continue by clicking the link to reset your password.</p>
	<p><?php echo sprintf(lang('email_forgot_password_subheading'), anchor('http://tracker.campaigncodex.com/passwordreset?resetcode='. $forgotten_password_code, lang('email_forgot_password_link')));?></p>
</body>
</html>