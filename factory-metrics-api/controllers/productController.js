const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { default: mongoose } = require("mongoose");
const { json } = require("express");

const getProducts = asyncHandler(async (req, res) => {
    
    const { name } = req.query;

    let products;

    if (name) {
        products = await Product.find({ name: { $regex: new RegExp(name, "i") } });
    } else {
        products = await Product.find();
    }

    res.status(200).json(products);
});

const getProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        const error = new Error("Product not found.");
        res.status(404);
        return next(error);
    }

    res.status(200).json(product);
    
})

const createProduct = asyncHandler(async (req, res) => {

    const { name, description, unit, status } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("Name is a mandatory field.");
    }

    const foundProduct = await Product.findOne({ name });

    if (foundProduct) {
        res.status(400);
        throw new Error("Another product with the exact same name is already registered. Please provide an unique name.");
    }

    const product = await Product.create({
        name,
        description,
        unit,
        status
    });

    res.status(201).json(product);

});

const updateProduct = asyncHandler(async (req, res) => {

    const foundProduct = await Product.findById(req.params.id);

    if (!foundProduct) {
        res.status(404);
        throw new Error("Product not found.");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )

    res.status(200).json(updatedProduct);

});

const deleteProduct = asyncHandler(async (req, res) => {

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
        res.status(404);
        throw new Error("Product not found.");
    }

    res.status(200).json({ message: `Deleted product of id ${req.params.id}` });

});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };