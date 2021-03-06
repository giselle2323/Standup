const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	event_id: {
		type: mongoose.Types.ObjectId,
		ref: "Event"
	}
});

const Quiz = mongoose.model("Quiz", quizSchema);


exports.Quiz = Quiz;

