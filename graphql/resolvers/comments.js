const Post = require("../../models/postModel");
const checkAuth = require("../../util/checkAuth");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
    Mutation: {
        // using arrow functions
        createComment: async (_, { postId, body }, context) => {
            const user = checkAuth(context);
            if (body.trim() === "") {
                throw new UserInputError("the comment must not be empty", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                });
            }
            const post = await Post.findById(postId);
            if (post) {
                post.comments.unshift({
                    body: body,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
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
            const post = await Post.findById(postId);
            if (post) {
                const commentIdx = post.comments.findIndex(c => c.id === commentId);
                if (post.comments[commentIdx].username === user.username) {
                    const updatedComments = post.comments.map(c => {
                        if (c.id === commentId) {
                            const newComment = {
                                id: c.id,
                                createdAt: c.createdAt,
                                first_name: c.first_name,
                                last_name: c.last_name,
                                username: c.username,
                                body: body
                            }
                            return newComment;
                        } else {
                            return c;
                        }
                    });
                    post.comments = updatedComments;
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
            } else {
                throw new UserInputError("Post not found");
            }
        },
        deleteComment: async (_, { postId, commentId }, context) => {
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                const commentIdx = post.comments.findIndex(c => c.id === commentId);
                if (post.comments[commentIdx].username = user.username) {
                    post.comments.splice(commentIdx, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } else {
                throw new UserInputError("Post not found");
            }

        }
    }
}