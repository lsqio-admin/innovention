module.exports = 
{
	 "title" : "Innovention Voting"
	,"subdomain":"Innovention"
	,"env": "dev"
	,"api"		: {
		"google"	: {
					 "email"	: true
					,"login"	: true
					,"name" 	: 'google'
					,"id"		: '198040123936-6p6u42g515p1fe3b6a9sk7qi2aj830j4.apps.googleusercontent.com'
					,"secret"	: '0cn6th2r9xhMQmHFVza1eXcd'
					,"scope"	: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
					,"consumer"	: false
					,"callback"	: '/auth/google/callback'
					,"entry"	: '/auth/google'
					,"redirect"	: '/'
				  }

				  ,"password"	: {
				  	,"name" 	: "password"
				  	,"extraParams": "{'name':{'first':params.first,'last':params.last},'gender':params.gender}"
				  }
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