const gql = require("graphql-tag");

const typeDefs = gql`
type Quiz{
    id: ID!
    questions: [Question!]
    course_name: String!
    quiz_title: String
    number_of_questions: Int!
    isOneWay: Boolean!
    createdBy: User!
    up_votes: [String!]
    down_votes: [String!]
    up_votes_counts: Int!
    down_votes_counts: Int!
    participants: Int!
    createdAt: String!
}

type Question{
    id: ID!
    question: String!
    answersOptions: [Answer!]
    correctAnswer: String!
}

type Answer{
    answerText: String!
}

type File{
    id: ID!
    file_url: String!
    uploadId: String!
    uploadedBy: User!
    createdAt: String!
    course_name: String!
    file_name: String!
    downloads: Int!
}

type User{
    id: ID!
    first_name: String
    last_name: String
    username: String
    password: String!
    university: String!
    major: String!
    isAdmin: Boolean!
    token: String!
    image: String
    quizizz: [Quiz!]
    posts: [Post!]
    files: [File!]
    up_voted_quiz:[Quiz!]
    down_voted_quiz:[Quiz!]
}

input RegisterInput {
    first_name: String!
    last_name: String!
    username: String!
    password: String!
    university: String
    major: String
    image: String
    isAdmin: Boolean!
}

input QuestionInput{
    id: ID!
    question: String!
    answersOptions: [AnswerInput!]
    correctAnswer: String!
}

input AnswerInput{
    answerText: String!
}


input QuizInput {
    questions: [QuestionInput!]
    course_name: String!
    quiz_title: String
    number_of_questions: Int!
    isOneWay: Boolean!
}

type Post{
    id: ID!
    body: String!
    image: String
    createdAt: String!
    createdBy: User!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentsCount: Int!
}

type Comment{
    id: ID!
    createdAt: String!
    createdBy: User!
    body: String!
}

type Like{
    id: ID!
    username: String!
}

type ItemsByCourseName{
    quizizz: [Quiz!]
    files: [File!]
}

type SearchResult{
    searchType: String!
    searchName: String!
}

type Query{
    getQuizizz: [Quiz!]
    getItemsByCourseName(course_name: String!): ItemsByCourseName!
    getQuiz(quizId: ID!): Quiz!
    getSearchOptions: [SearchResult!]
    getUser(username: String!): User!
    getPosts: [Post!]
    getPost(postId: ID!): Post!
    getFiles: [File!]
}
type Mutation{
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    updataProfileImage(image: String!): User!
    createQuiz(quizInput: QuizInput): Quiz!
    updateQuiz(quizId: ID!, quizInput: QuizInput): Quiz!
    deleteQuiz(quizId: ID!): String!
    quizParticipants(quizId: ID): Quiz!
    upVoteQuiz(quizId: ID!, userId: ID!): Quiz!
    downVoteQuiz(quizId: ID, userId: ID!): Quiz!
    createPost(body: String!, image: String): Post!
    updatePost(postId: ID!, body: String!, image: String): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    updateComment(postId: ID!, commentId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    uploadFile(course_name: String!, file_name: String, file_url: String!, uploadId: String!): File!
    deleteFile(fileId: ID!): String!
}
`

module.exports = typeDefs;