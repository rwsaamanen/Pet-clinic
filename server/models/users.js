import mongoose from 'mongoose';

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
    // Include any other relevant fields here
});

const users = mongoose.model('users', userSchema);

export default users;
