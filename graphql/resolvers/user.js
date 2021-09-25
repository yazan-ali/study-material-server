const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("../../util/checkAuth");

const User = require("../../models/userModel");
const Post = require("../../models/postModel");
const { validateRegisterInput, validateLoginInput } = require("../../util/validators");

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        isAdmin: user.isAdmin,
        image: user.image,
    }, process.env.TOKEN_SECRETE, { expiresIn: "1h" }
    )
}

module.exports = {
    Query: {
        async getUser(_, { username }) {
            try {
                const user = await User.findOne({ username: username }).populate({
                    path: "quizizz",
                    options: { sort: { 'createdAt': -1 } },
                }).populate({
                    path: "posts",
                    populate: {
                        path: "comments.createdBy",
                    },
                }).populate({
                    path: "posts",
                    options: { sort: { 'createdAt': -1 } },
                    populate: {
                        path: "createdBy",
                    },
                }).populate({
                    path: "files",
                    options: { sort: { 'createdAt': -1 } }
                })
                if (user) {
                    return user;
                } else {
                    throw new UserInputError("User not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            const user = await User.findOne({ username });

            if (!valid) {
                throw new UserInputError("Errors", {
                    errors: errors
                });
            }

            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found", {
                    errors: errors
                });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong credantials";
                throw new UserInputError("Wrong credantials", {
                    errors: errors
                });
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, { registerInput: { first_name, last_name, username, password, university, major, isAdmin, image } }, context, info) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(first_name, last_name, username, password,);
            if (!valid) {
                throw new UserInputError("Errors", {
                    errors: errors
                })
            }
            const user = await User.findOne({ username: username });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                });
            }
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                username: username,
                password: password,
                university: university,
                major: major,
                isAdmin: isAdmin,
                image: image
            });
            const result = await newUser.save();

            const token = generateToken(result);
            return {
                ...result._doc,
                id: result._id,
                token
            }
        },
        async updataProfileImage(_, { image }, context) {
            const user = checkAuth(context);

            if (user) {
                const result = await User.findOne({ username: user.username });

                result.image = image
                await result.save();
                return result;
            } else {
                throw new UserInputError("User not found");
            }

        },
    }
}