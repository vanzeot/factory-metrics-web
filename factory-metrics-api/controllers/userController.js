const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Add the user to the DB
const registerUser = asyncHandler( async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, e-mail and password are mandatory.");
    }

    const userAvaiable = await User.findOne({ email });

    if (userAvaiable) {
        res.status(400);
        throw new Error("E-mail already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid.");
    }

    res.json({ message: "User registered."});

})

// Perform authentication
const loginUser = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("E-mail and password are mandatory.");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))){

        const accessToken = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id
                },

            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "30min" }
        );

        res.status(200).json({ accessToken });

    } else {

        res.status(401);
        throw new Error("E-mail or password is not valid.");

    }

})

// Get the current authenticated user
const currentUser = asyncHandler(async (req, res) => {

    res.json(req.user);

});

module.exports = { registerUser, loginUser, currentUser};