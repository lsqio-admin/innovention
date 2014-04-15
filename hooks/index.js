(function(exports){

	var  http 		= require('http')
		, _ 	 	= require('underscore')
		, hook 		= {}
		, db;

	exports.run =function(options){
		db = options.db;
		events()
	}
	exports.routes = function(app){
	
		app.get("/hello",function(req,res){
			res.send("world")
		})

		app.get("/count",function(req,res){
			db.count("instance",{},function(err,data){
				res.send("there are "+data+" visitors on the site now.")
			})		
		})
		app.get("/session",function(req,res){
			res.send(req.session)	
		})
		app.get("/amILoggedIn",function(req,res){
			res.send(_.has(req.session,"p"))	
		})
	return app;
	}
	var events = function(){
		// db.when("instance","create",function(data){
		// 	console.log("instance","create",data)
		// })
		// db.when("instance","delete",function(data){
		// 	console.log("instance","delete",data)
		// })
		// db.when("instance","update",function(data){
		// 	console.log("instance","update",data)
		// })
		
	}
return exports;
})(exports)
