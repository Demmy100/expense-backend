const mongoose = require("mongoose")

const IncomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    amount: {
        type: Number,
        required: true,
        maxLenght: 20,
        trim: true,
    },
    type: {
        type: String,
        default: "income"
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
},
{
    timestamps: true
}
)

module.exports = mongoose.model("Income", IncomeSchema)