const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
    },

    fee:{
        type: Number,
    },

    paidAmount:{
        type: Number,
    },

    paymentNote:{
        type: String,
        trim: true
    },

    feeStatus: {
        type: Boolean,
        default: false
    },

},
{
    timestamps: true
}
)


module.exports = mongoose.model("Record", recordSchema)