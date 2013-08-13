/* RequireJS module template 
	
	this checks authentication and routes accordingly 
	
*/
define(['views/index'], function(indexView){
	// Internal program code
	
	var initialize = function() {
		checkLogin(runApplication)
	}
	
	var checkLogin = function(callback) {
		$.ajax("/account/authenticated", {
			method: "GET",
			success: function() {
				return callback(true);
			},
			error: function(data) {
				return callback(false);
			}
		});
	};
	
	var runApplication = function(authenticated) {
		if(!authenticated) 
			window.location.hash = 'login';
		else
			window.location.hash = 'index';
			
		Backbone.history.start();
	}
	
	return {
		//Expose externally accessible functions
		initialize: initialize;
	};
});