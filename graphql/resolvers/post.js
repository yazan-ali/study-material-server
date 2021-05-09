const Post = require("../../models/postModel");
const User = require("../../models/userModel");
const checkAuth = require("../../util/checkAuth");

const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find({}).sort({ createdAt: -1 }).populate("createdBy");
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId).populate("createdBy");
                if (post) {
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async createPost(_, { body, image }, context) {
            let user = checkAuth(context);
            user = await User.findById(user.id);
            // if checkAuth dose not throw err then everything is okay and the code continue

            if (body.trim() === "") {
                throw new Error("Post body must not be empty");
            }

            const newPost = new Post({
                body: body,
                image: image,
                createdBy: user.id,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();
            user.posts.push(post);
            await user.save();
            return post;
        },
        updatePost: async (_, { postId, body, image }, context) => {
            const user = checkAuth(context);

            if (body.trim() === "") {
                throw new UserInputError("the post must not be empty", {
                    errors: {
                        body: "Post body must not be empty"
                    }
                });
            }

            const post = await Post.findById(postId).populate("createdBy");
            if (post) {
                if (post.createdBy.username === user.username) {
                    const updatedPost = {
                        body: body,
                        image: image
                    }
                    const result = await Post.findByIdAndUpdate(postId, updatedPost, { useFindAndModify: false });
                    return result;
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
            } else {
                throw new UserInputError("Post not found");
            }
        },
        async deletePost(_, { postId }, context) {
            let user = checkAuth(context);
            user = await User.findById(user.id);
            try {
                const post = await Post.findById(postId).populate("createdBy");
                if (user.username === post.createdBy.username) {
                    await post.delete();
                    user.posts = user.posts.filter(p =>
                        p != postId
                    );
                    await user.save();
                    return "Post deleted successfully";
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(like => like.username === user.username)) {
                    // Post already liked so unliked it
                    post.likes = post.likes.filter(like => like.username !== user.username);
                } else {
                    // not liked post so like it
                    post.likes.push({
                        username: user.username,
                    })
                }
                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found");
            }
        }
    }
}