module.exports = 
{
	 "title" : "Live Sqrd"
	,"api"		: {
				}
	,"useAuth" 	: false
	,"auth" 	: {
					'user':'pass'
				  }
	,"token"	: [
					{"name": "general"
					,"val": "abcdefg"}
				]
	,"views" 	: "client/views"
	,"favicon"	: "client/org/img/favicon.ico"
	,"git"		: {
					 "autopull"	:true
				}
}

//title is the page title
//api is for user authentication
//userAuth is if you want basic auth on each key is the user val is pass
//token is used for api calls and sdk, the val is key
//favicon location 
//git autopull is for evertime you push the server pull the changes