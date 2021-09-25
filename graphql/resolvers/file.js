const File = require("../../models/fileModel");
const User = require("../../models/userModel");
const checkAuth = require("../../util/checkAuth");

const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
    Query: {
        async getFiles() {
            try {
                const files = await File.find({}).sort({ createdAt: -1 })
                return files;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async uploadFile(_, { course_name, file_name, file_url, uploadId }, context) {
            let user = checkAuth(context);
            user = await User.findById(user.id);

            if (course_name.trim() === "") {
                throw new Error("Course name must not be empty");
            }

            if (file_name.trim() === "") {
                throw new Error("File name must not be empty");
            }
            try {
                const newFile = new File({
                    course_name: course_name,
                    file_name: file_name,
                    file_url: file_url,
                    uploadId: uploadId,
                    uploadedBy: {
                        id: user.id,
                        username: user.username
                    },
                    createdAt: new Date().toISOString()
                });
                const file = await newFile.save();
                user.files.push(file);
                await user.save();
                return file;
            } catch (err) {
                throw new Error(err)
            }
        },
        async deleteFile(_, { fileId }, context) {
            let user = checkAuth(context);
            user = await User.findById(user.id);
            try {
                const file = await File.findById(fileId);
                if (user.username === file.uploadedBy.username) {
                    await file.delete();
                    user.files = user.files.filter(f =>
                        f != fileId
                    );
                    await user.save();
                    return "File deleted successfully";
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}
