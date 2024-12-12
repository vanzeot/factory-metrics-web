const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
    {
        created_by_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User"
        },
        updated_by_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User"
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please inform the product id"],
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: [true, "Please inform the quantity"]
        },
        date: {
            type: Date,
            required: [true, "Please inform the production date"]
        },
        remarks: {
            type: String,
            maxlength: [200, "Remarks cannot exceed 100 characters"],
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);
