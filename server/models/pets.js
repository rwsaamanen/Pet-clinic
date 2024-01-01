import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    ownerId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    petType: {
        type: String,
        required: true,
        enum: ['dog', 'cat'] // Assuming only dogs and cats are allowed. Add more types if needed.
    },
    status: {
        type: String,
        required: true,
        enum: ['alive', 'deceased']
    },
    dob: {
        type: Date,
        required: true
    }
});

const pets = mongoose.model('pets', petSchema);

export default pets;
