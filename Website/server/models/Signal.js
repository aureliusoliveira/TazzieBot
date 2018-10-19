import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SignalSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL']
    },
    symbol: String,
    entryPrice: Number,
    stopLoss: Number,
    takeProfit: Number,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    img: String,
    risk: Number,
    date: {
        type: Date,
        default: Date.now()
    },
    status: String,
    restricted: {
        type: Boolean,
        default: false
    },
    viewRole: {
        type: String,
        enum: ['FREE', 'PAID', 'PREMIUM', 'ADMIN'],
        default: 'FREE'
    },
    editRole: {
        type: String,
        enum: ['FREE', 'PAID', 'PREMIUM', 'ADMIN'],
        default: 'FREE'
    },
    expiry: Date,
    removed: {
        type: Boolean,
        default: false
    },
    expired: {
        type: Boolean,
        default: false
    },
});

const Signal = mongoose.model('Signal', SignalSchema);
module.exports = Signal;