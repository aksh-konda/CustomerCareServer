const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    issueId: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 12,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Closed'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Issues', issueSchema);