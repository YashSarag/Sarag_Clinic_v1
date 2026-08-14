const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },

    lname: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        min: 0
    },

    sex: {
        type: String,
        enum: ["male","female"],
        required: true,
    },

    village: {
        type: String,
        trim: true,
        required: true
    },

    mobile: {
        type: String,
        trim: true,
        required: true
    },

    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Record'
    }]
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Patient', patientSchema);