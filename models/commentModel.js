const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    body: String,
    first_name: String,
    last_name: String,
    username: String,
    user_image: String,
    createdAt: String,
});

module.exports = mongoose.model("Comments", commentSchema);