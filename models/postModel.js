// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//     body: String,
//     createdAt: String,
//     image: String,
//     comments: [{
//         body: String,
//         first_name: String,
//         last_name: String,
//         username: String,
//         user_image: String,
//         createdAt: String,
//     }],
//     likes: [{
//         username: String,
//     }],
//     createdBy: {
//         username: String,
//         first_name: String,
//         last_name: String,
//         image: String,
//     }
// });

// module.exports = mongoose.model("Post", postSchema);


const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    body: String,
    createdAt: String,
    image: String,
    comments: [{
        body: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: String,
    }],
    likes: [{
        username: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Post", postSchema);
