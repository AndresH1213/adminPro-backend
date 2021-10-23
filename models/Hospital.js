const { Schema, model } = require('mongoose');


// to change the name put {collection: name} as second arg
const HopitalSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});


HopitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object
})

module.exports = model('Hospital', HopitalSchema );