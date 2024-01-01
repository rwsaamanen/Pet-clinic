import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing
        required: true,
        ref: 'Pet' // Reference to the Pet model
    },
    date: {
        type: Date,
        required: true
    },
    comment: {
        type: String,
        default: '' // Assuming comments can be optional
    }
});

const visits = mongoose.model('visits', visitSchema);

export default visits;
