define([],function(){
	return function(model) {
		var comp;
		if(model.has('title'))
		  	comp = model.get('title').toLowerCase();
		else if(model.has('name'))
		  	comp = model.get('name').toLowerCase();
		else 
			comp = model.get('_id');
		  return comp;
		};
});