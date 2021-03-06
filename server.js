//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var Nexmo = require("nexmo");
var nexmo = new Nexmo({
	apiKey:"7b9e5c61",
	apiSecret: "22081a8215dcfc86"
});
//set up express app"
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
//set friends list
var friendPool = [];
//direct routes
app.get("/", function(req,res){
	res.sendFile(path.join(__dirname,"/index.html"));
});
app.get("/survey", function(req,res){
	res.sendFile(path.join(__dirname,"/survey.html"));
});
app.get("/api/friends", function(req,res){
	res.json(friendPool);
});
//add user profile to friends array for matching
app.post("/api/new",function(req,res){
	var userProfile = req.body;
	if (friendPool.length > 0){
		for (var i=0;i<friendPool.length;i++){
			if(friendPool[i].photoURL === userProfile.photoURL && friendPool[i].name === userProfile.name){

				return;
			};
		};
		friendPool.push(userProfile);
	}else{
		friendPool.push(userProfile);
	}
})
//serever listener
app.listen(PORT, function(){
	console.log("app listening on port: "+PORT);
});


