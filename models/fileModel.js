const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
    },
    file_url: {
        type: String,
    },
    uploadId: String,
    uploadedBy: {
        type: Object,
        required: true
    },
    downloads: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: String
    }
});

module.exports = mongoose.model("File", fileSchema);
