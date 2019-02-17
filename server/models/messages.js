const mongoose = require('mongoose');

const publicMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const privateMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    message: {
        type: String,
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    createdDate: {
        type: Date, 
        default: Date.now,
        required: true
    }
})

// const publicRoomsSchema = new mongoose.Schema({
//     participants: [{
//         socketId: {
//             type: String,
//         },
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'users'
//         },
//         accessTime: {
//             type: Date,
//             default: Date.now
//         }
//     }]
// })

const publicRoomsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    accessTime: {
        type: Date,
        default: Date.now
    }
})

const privateMessage = mongoose.model('privateMessage', privateMessageSchema, 'privateMessage');
const publicMessage = mongoose.model('publicMessage', publicMessageSchema, 'publicMessage');

const publicRoom = mongoose.model('publicRoom', publicRoomsSchema, 'publicRoom');

module.exports = {
    PrivateMessage: privateMessage,
    PublicMessage: publicMessage,

    PublicRoom: publicRoom
}