const Quiz = require("../../models/quizModel");
const User = require("../../models/userModel");
const checkAuth = require("../../util/checkAuth");

const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
    Query: {
        async getQuizizz() {
            try {
                const quizizz = await Quiz.find({}).sort({ createdAt: -1 });
                return quizizz;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getQuizizzByCourseName(_, { course_name }) {
            try {
                const quizizz = await Quiz.find({ course_name: course_name }).sort({ createdAt: -1 });
                return quizizz;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getQuiz(_, { quizId }) {
            try {
                const quiz = await Quiz.findById(quizId);
                if (quiz) {
                    return quiz;
                } else {
                    throw new Error("Quiz not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getSearchOptions() {
            try {
                const quizizz = await Quiz.find({});
                const users = await User.find({});
                const searchOptions = [];
                quizizz.map(q => {
                    if (searchOptions.includes(q.course_name)) return
                    else {
                        searchOptions.push({
                            searchType: "course_name",
                            searchName: q.course_name
                        }
                        )
                    }
                });
                users.map(u => {
                    if (searchOptions.includes(u.username)) return
                    else {
                        searchOptions.push({
                            searchType: "user",
                            searchName: u.username
                        }
                        )
                    }
                });
                return searchOptions;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        createQuiz: async (_, { quizInput: { questions, course_name, quiz_title, number_of_questions, isOneWay } }, context) => {
            let user = checkAuth(context);
            user = await User.findById(user.id);
            try {
                const newQuiz = new Quiz({
                    course_name: course_name,
                    quiz_title: quiz_title,
                    number_of_questions: number_of_questions,
                    isOneWay: isOneWay,
                    questions: questions,
                    createdBy: {
                        id: user.id,
                        username: user.username
                    },
                    createdAt: new Date().toISOString()
                });
                const quiz = await newQuiz.save();
                user.quizizz.push(quiz);
                await user.save();
                return quiz;
            } catch (err) {
                throw new Error(err);
            }
        },
        updateQuiz: async (_, { quizId, quizInput: { questions, course_name, quiz_title, number_of_questions, isOneWay } }, context) => {
            const user = checkAuth(context);
            const quiz = await Quiz.findById(quizId);
            if (quiz) {
                if (quiz.createdBy.username === user.username) {
                    const updatedQuiz = {
                        course_name: course_name,
                        quiz_title: quiz_title,
                        number_of_questions: number_of_questions,
                        isOneWay: isOneWay,
                        questions: questions,
                        createdBy: {
                            id: user.id,
                            username: user.username
                        }
                    }
                    const result = await Quiz.findByIdAndUpdate(quizId, updatedQuiz, { useFindAndModify: false });
                    return result;
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
            } else {
                throw new UserInputError("Quiz not found");
            }
        },
        deleteQuiz: async (_, { quizId }, context) => {
            let user = checkAuth(context);
            user = await User.findById(user.id);
            try {
                const quiz = await Quiz.findById(quizId);
                if (quiz) {
                    if (quiz.createdBy.username === user.username) {
                        await quiz.delete();
                        user.quizizz = user.quizizz.filter(q =>
                            q != quizId
                        );
                        await user.save();
                        return "Quiz deleted successfully";
                    } else {
                        throw new AuthenticationError("Action not allowed")
                    }
                } else {
                    throw new UserInputError("Quiz not found");
                }
            } catch (err) {
                throw new Error(err);
            }

        },
        quizParticipants: async (_, { quizId }) => {
            const quiz = await Quiz.findById(quizId);
            if (quiz) {
                quiz.participants = quiz.participants + 1;
                await quiz.save();
                return quiz;
            } else {
                throw new UserInputError("Quiz not found");
            }
        },
        upVoteQuiz: async (_, { quizId, userId }, context) => {
            checkAuth(context);
            const quiz = await Quiz.findById(quizId);
            const user = await User.findById(userId);
            try {
                if (quiz) {
                    // if user not up voted befor or he alrady down voted
                    if (!quiz.up_votes.includes(userId) || quiz.down_votes.includes(userId)) {
                        // if he down voted we remove the down vote then up vote
                        quiz.down_votes = await quiz.down_votes.filter(id => id != userId);
                        user.down_voted_quiz = await user.down_voted_quiz.filter(id => id != quizId);
                        // up vote
                        await quiz.up_votes.push(userId);
                        await user.up_voted_quiz.push(quizId);
                    }
                    // if user alrady up voted so he want to remove the up vote
                    else if (quiz.up_votes.includes(userId)) {
                        quiz.up_votes = await quiz.up_votes.filter(id => id != userId);
                        user.up_voted_quiz = await user.up_voted_quiz.filter(id => id != quizId);
                    }
                    await quiz.save();
                    await user.save();
                    return quiz;
                } else {
                    throw new UserInputError("Quiz not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        downVoteQuiz: async (_, { quizId, userId }, context) => {
            checkAuth(context);
            const quiz = await Quiz.findById(quizId);
            const user = await User.findById(userId);
            try {
                if (quiz) {
                    // if user not down voted befor or he alrady up voted
                    if (!quiz.down_votes.includes(userId) || quiz.up_votes.includes(userId)) {
                        // if he up voted we remove the up vote then down vote
                        quiz.up_votes = await quiz.up_votes.filter(id => id != userId);
                        user.up_voted_quiz = await user.up_voted_quiz.filter(id => id != quizId);
                        // down vote
                        await quiz.down_votes.push(userId);
                        await user.down_voted_quiz.push(quizId);
                    }
                    // if user alrady down voted so he want to remove the down vote
                    else if (quiz.down_votes.includes(userId)) {
                        quiz.down_votes = await quiz.down_votes.filter(id => id != userId);
                        user.down_voted_quiz = await user.down_voted_quiz.filter(id => id != quizId);
                    }
                    await quiz.save();
                    await user.save();
                    return quiz;
                } else {
                    throw new UserInputError("Quiz not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}