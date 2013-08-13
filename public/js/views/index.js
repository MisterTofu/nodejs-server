// RequireJS loads templates/index.html as a string of text
// Returns the string as an object to the caller 
define(['text!templates/index.html'], function(indexTemplate) {
	var indexView = Backbone.View.extend({
		el: $('#content'),
		
		render: function(){
			this.$el.html(indexTemplate);
		}
	});
	
	return new indexView;
});