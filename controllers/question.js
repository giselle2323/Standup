const { Question } = require("../models/questions");

exports.getCreateQuestionPage = async (req, res) => {
    try {
        const quiz_id = req.params.id;
        const quiz = await Quiz.findById(req.params.id);
        const event_id = quiz.event_id;
        res.render("activity", { quiz_id, event_id });
    } catch (error) {
        console.log(error);
    }
}
exports.getQuestionById = async (req, res) => {
    try {
        const query = { quiz_id: req.params.id };
        const question = await Question.find(query);
        const user = req.session.user;
        res.render("startquiz", { question, quiz_id: req.params.id, user, clickHandler: "next();", startHandler: "start();", onchangeHandler: "onChange();" });

    } catch (error) {
        console.log(error.message);
    }
}
exports.editQuestionPage = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        console.log(question);
        res.render("editquestion", { question });
    } catch (error) {
        console.log(error.messaage)
    }
}
exports.editQuestion = async (req, res) => {
    try {
        const body = {
            question: req.body.question,
            answers: req.body.answers,
            correctAnswer: req.body.correctAnswer
        };
        await Question.findByIdAndUpdate(req.params.id, body, function (err, question) {
            const quiz_id = question.quiz_id;
            if (err) {
                console.log(err);
            }
            req.flash("success", { message: "Question edited succesfully" });
            res.redirect("/activity/question/" + quiz_id);
        });
    } catch (error) {
        console.log(error.message);
    }
}
exports.deleteQuestion = async (req, res) => {
    try {
        await Quiz.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/events/all");
        });
    } catch (error) {
        console.log(error.meassage);
    }
}

exports.getAllQuestions = async (req, res) => {
    try {
        const quizId = req.params.id;
        const query = { quiz_id: quizId };
        const questions = await Question.find(query).sort();
        res.render("questions", { questions });
    } catch (error) {
        console.log(error);
    }


}

exports.allQuestionPage = async (req, res) => {
    try {
        const question = await Question.find().sort();
        res.render("questions", { question });
    } catch (error) {
        console.log(error);
    }


}