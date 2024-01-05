import mongoose from 'mongoose';

// visitSchema

const visitSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet'
    },
    date: {
        type: Date,
        required: true
    },
    comment: {
        type: String,
        default: ''
    }
});

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
