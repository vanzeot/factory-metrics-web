const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const validateToken = require("./middleware/tokenHandler");
const dotenv = require("dotenv").config();

connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use(errorHandler);
app.use(validateToken);

app.listen( port, () => {
    console.log(`Server running on port ${port}`);
});