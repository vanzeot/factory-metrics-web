const mongoose = require("mongoose");
const UnitOfMeasurement = require("./unitOfMeasurementEnum");


const ProductStatus = {
    VALID: "valid",
    DISCONTINUED: "discontinued"
};

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: [40, "Name cannot exceed 40 characters"],
            required: [true, "Please inform the name"]
        },
        description: {
            type: String,
            maxlength: [150, "Remarks cannot exceed 150 characters"],
            required: [true, "Please inform a brief description"]
        },
        unit: {
            type: String,
            required: [true, "Unit of measurement is required"],
            enum: Object.values(UnitOfMeasurement)
        },
        status: {
            type: String,
            enum: Object.values(ProductStatus),
            default: ProductStatus.VALID,
        }
    },
    {
        timestamps: true
    }
);

productSchema.pre("save", function (next) {
    console.log("pre")
    // Check that the unit is valid
    if (!Object.values(UnitOfMeasurement).includes(this.unit)) {
        return next(new Error("Unit must be one of the allowed values."));
    }

    // Check that the unit is not "--"
    if (this.unit === "--") {
        return next(new Error("Unit cannot be '--'."));
    }

    // If all checks pass, move to the next function
    next();
});

module.exports = mongoose.model("Product", productSchema);
