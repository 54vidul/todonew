var mongoose = require('mongoose');

//CREATE A MONGOOSE MODEL
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        //VALIDATORS
        minlength: 1,
        required: true,
        //REMOVE BLANK SPACES
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    madeOn: {
        type: Number,
        default: null
    },
    //FOR AUTHENTICATION AND GET ONLY USER SPECIFIC DATA
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {
    Todo
};