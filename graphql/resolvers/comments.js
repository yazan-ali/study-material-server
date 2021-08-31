const Post = require("../../models/postModel");
const Comment = require("../../models/commentModel");
const checkAuth = require("../../util/checkAuth");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const user = checkAuth(context);
            if (body.trim() === "") {
                throw new UserInputError("the comment must not be empty", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                });
            }

            const newComment = {
                body: body,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                user_image: user.image,
                createdAt: new Date().toISOString()
            }

            const comment = new Comment(newComment);
            await comment.save();

            const post = await Post.findById(postId);


            if (post) {
                post.comments.unshift(comment._id)
                await post.save();

                return await Post.findById(postId).populate("comments");
            } else {
                throw new UserInputError("Post not found");
            }
        },
        updateComment: async (_, { postId, commentId, body }, context) => {
            const user = checkAuth(context);

            if (body.trim() === "") {
                throw new UserInputError("the comment must not be empty", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                });
            }

            const comment = await Comment.findOne({ _id: commentId });
            comment.body = body
            await comment.save();

            const post = await Post.findById(postId).populate("comments");
            return post;
        },
        deleteComment: async (_, { postId, commentId }, context) => {
            const user = checkAuth(context);


            await Comment.findByIdAndDelete(commentId);

            return await Post.findById(postId).populate("comments");
        }
    }
}