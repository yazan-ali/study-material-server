const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    body: String,
    createdAt: String,
    image: String,
    comments: [{
        body: String,
        first_name: String,
        last_name: String,
        username: String,
        createdAt: String,
    }],
    likes: [{
        username: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Post", postSchema);
