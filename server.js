const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require('dotenv').config();
const path = require('path');


const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) =>
        // we forward the req
        ({ req })
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.db,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
        return server.listen({ port: PORT });
    }).then(res => {
        console.log(`Server running at ${res.url}`)
    });