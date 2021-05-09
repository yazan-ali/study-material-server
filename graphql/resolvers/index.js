const quizResolvers = require("./quiz");
const usersResolvers = require("./user");
const postResolvers = require("./post");
const commentsResolvers = require("./comments");

module.exports = {
    Quiz: {
        up_votes_counts: (parent) => parent.up_votes.length,
        down_votes_counts: (parent) => parent.down_votes.length
    },
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentsCount: (parent) => parent.comments.length
    },
    Query: {
        ...quizResolvers.Query,
        ...usersResolvers.Query,
        ...postResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...quizResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
}