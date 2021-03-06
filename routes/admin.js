const express = require("express");
const { Userscores } = require("../models/userscores");
const redirectLogin = require("../middleware/redirectLogin");

let router = express.Router();

//ADMIN DASHBOARD ROUTE----------ADMIN ROUTE
router.get("/dashboard", redirectLogin, function (req, res) {
	Userscores.aggregate(
		[
			{
				$group:
				{
					_id: "$user_id",
					avgScore: { $avg: "$score" }
				}
			},
			{
				$lookup: {
					from: "Users",
					localField: "_id",
					foreignField: "_id",
					as: "user"
				}
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: [
							{ $arrayElemAt: ["$user", 0] }, "$$ROOT"
						]
					}
				}
			},
			{
				$project: {
					user: 0, password: 0, __v: 0
				}
			}
		], function (err, result) {
			if(err){
				console.log(err)
			}
			
			for (i = 0; i < result.length; i++) {
			 var scoreArray = [];
			 scoreArray.push(result[i].avgScore);
				var highestScore = 0;
				for(j=0; scoreArray.length > j; j++){
					if(scoreArray[j] > highestScore){
						highestScore = scoreArray[j];
					}
				}
			}
			res.render("dashboard", { result, highestScore });
			
		}
		
	)

	
});

module.exports = router;
