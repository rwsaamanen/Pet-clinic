import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    petType: {
        type: String,
        required: true,
        enum: ['dog', 'cat']
    },
    status: {
        type: String,
        required: true,
        enum: ['alive', 'deceased'],
        default: 'alive'
    },
    dob: {
        type: Date,
        required: true
    },
    comments: [{
        type: String
    }]
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
