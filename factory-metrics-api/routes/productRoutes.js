const express = require("express");
const validateObjectId = require("../middleware/objectIdHandler");
const validateToken = require("../middleware/tokenHandler");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();
router.use(validateToken);

router.route("/")
    .get(getProducts)
    .post(createProduct);
router.route("/:id")
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);
    // if needed, add validateObjectId as first argument

module.exports = router;