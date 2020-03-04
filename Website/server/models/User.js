import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    username: String,
    password: String,
    email: String,
    role: {
        type: String,
        enum: ['FREE', 'PAID', 'PREMIUM', 'ADMIN'],
        default: 'FREE'
    },
    numbers: Number,
    profilePic: String,
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    },
    //Relationships
    signals: [{
        type: Schema.Types.ObjectId,
        ref: 'Signal'
    }]
});

UserSchema.methods.findSimilarTypes = function(cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};


const User = mongoose.model('User', UserSchema);
module.exports = User;