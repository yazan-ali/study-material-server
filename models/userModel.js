const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        require: true
    },
    university: String,
    major: String,
    image: String,
    quizizz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    }],
    up_voted_quiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    }],
    down_voted_quiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    }],
});

module.exports = mongoose.model("User", userSchema);