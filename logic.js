$(document).ready(function(){
	//setup constructor for profile
	var Profile = function(name,photoURL,scores){
		this.name = name,
		this.photoURL = photoURL,
		this.scores = scores
	};
	//validate form and create user profile
	$("#submit").on("click", function(){
		var name = $("#name").val().trim();
		var photoURL = $("#photo").val().trim();
		var question = $(".chosen-select").val();
		var scores = [];
		for(i=0;i<10;i++){
			var num = i + 1;
			var answer = $("#q"+ num).val();
			answer = parseInt(answer);
			scores.push(answer);
		};
		function validate(){
			valid = true;
			if (name === ""){
				valid = false;
				return valid;
			}
			if (photoURL === ""){
				valid = false;
				return valid;
			}
			if (question === ""){
				valid = false;
				return valid;
			}
			return valid;
		}

		var validated = validate();

		if (validated){
			//create user profile
			var userProfile = new Profile(name, photoURL, scores);
			//update user infor thumbnail in modal
			$("#yourImg").attr("src",userProfile.photoURL);
			$("#yourName").html(userProfile.name);
			//	send user profile to server to be processed and sent to api/friends
			$.post("/api/new",userProfile,function(){
			});

			//get all profiles for user matching
			$.get("/api/friends", function(res){
				//set array to hold candidates to avoid the user matching him himself/herself
				var candidates = [];
				//set total user score var to compare user and db scores
				var totalUserScore = 0;
				//set array to hold total score for each candidate
				var canScores = [];
				//set array to hold matches
				var matches = [];


				function userTotal(){
					//loop through user scores to get total score
					for(var j=0;j<userProfile.scores.length;j++){
						//set score var and parse to integer
						var score = parseInt(userProfile.scores[j]);
						//increase total user score value by each individual score
						totalUserScore += score;
					};
					return totalUserScore;
				}
				function getCandidates(){
					for(var i=0;i<res.length;i++){
						if (res[i].photoURL !== userProfile.photoURL && res[i].name !== userProfile.name){
							candidates.push(res[i]);
						}
					}
				}

				function candidateTotals(){
					//loop through to get total scores for each candidate
					for(var i=0;i<candidates.length;i++){
						//set candidate score to 0 each time i iterates
						var candidateScore = 0;
						//loop though each candidates scores and add them together
						for (var k=0;k<10;k++){
							candidateScore += parseInt(candidates[i].scores[k]);
						}
						//push candidate score to can scores array for each candidate
						canScores.push(candidateScore);
					};
				}
					
					function closest(num,arr){
						//set curr to first number in array
		                var curr = arr[0];
		                //set diff to absolute val of num - curr
		                var diff = Math.abs (num - curr);
		                //loop through each number in array
		                for (var l = 0; l < arr.length; l++) {
		                	//set new diff var
		                    var newdiff = Math.abs (num - arr[l]);
		                    //if new diff is lower than old diff
		                    if (newdiff < diff) {
		                    	//set diff to new diff
		                        diff = newdiff;
		                        //set curr to that number
		                        curr = arr[l];
		                    };
		                };
		                // //return value of closest number
		                return curr;
		            };

		            function getMatches(){
			            //set closest score var to use closest function to find the best matched score
			            var closestScore = closest(totalUserScore,canScores);
			            //loop through candidates
			            for(var m = 0;m<candidates.length;m++){
			            	//if a candidates total score is the closest to the users total score
			            if(canScores[m] == closestScore){
			            		//push candidate object to matches array if the match does not have the same name
			            			matches.push(candidates[m]);
			            	};
			            };
		            }

		            function displayMatch(){
			            //set random number var to use as index for match in matches array
			            var random = Math.floor(Math.random()*matches.length);
			            //if matches exist
			            if (matches.length > 0){
			            	//set matched friend variable to a random match with closest score
			            	var matchedFriend = matches[random];
			            		//update html
				            	$("#comment").html("Congratulations! It's a Match!");
			            }else{
			            	//if there are no matches other than the user make matched friend no one
			            	var matchedFriend = new Profile("Forever Alone","https://acculturated.com/wp-content/uploads/2016/04/Loneliness_blog_photo_3-13.jpg")
			            	$("#comment").html("well this just got awkward.. you are the only one here!");
			            };
			            //update matched friend thumbnail in modal
			           	$("#matchedImg").attr("src",matchedFriend.photoURL);
			           	$("#matchedName").html(matchedFriend.name);
		            }


		            //calculate user total
		            userTotal();
		            //get potential candidates for matching
		            getCandidates();
		            //calculate candidate totals
		            candidateTotals();
		            //get all matches
		            getMatches();
		            //diplay a random match from matches
		            displayMatch();

				})
			
			//trigger modal
			$(".modal").modal("toggle");	
		}else{
			//if the client does not enter values for all fields
			alert("please enter all form fields for best results..")
		}
	});
})
