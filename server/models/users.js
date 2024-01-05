import mongoose from 'mongoose';

// userSchema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['doctor', 'pet_owner'],
        default: 'pet_owner',
    },
});

const users = mongoose.model('users', userSchema);

export default users;
