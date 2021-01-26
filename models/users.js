const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 12,
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 64
    }
});

module.exports = mongoose.model('Users', userSchema);