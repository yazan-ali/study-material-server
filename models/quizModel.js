const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true
    },
    quiz_title: {
        type: String,
    },
    number_of_questions: {
        type: Number,
        min: 1,
        max: 100,
        required: true
    },
    isOneWay: Boolean,
    questions: {
        type: Array,
        required: true
    },
    createdBy: {
        type: Object,
        required: true
    },
    up_votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    down_votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    participants: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: String
    }
});

module.exports = mongoose.model("Quiz", quizSchema);
