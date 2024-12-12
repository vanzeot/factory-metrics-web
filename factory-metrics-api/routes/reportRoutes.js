const express = require("express");
const validateObjectId = require("../middleware/objectIdHandler");
const validateToken = require("../middleware/tokenHandler");
const {
    getAllReports,
    getReport,
    getMonthlyReport,
    createReport,
    updateReport,
    deleteReport
} = require("../controllers/reportController")

const router = express.Router();
router.use(validateToken);

router.route("/")
    .get(getAllReports)
    .post(createReport);

router.route("/monthly/:year/:month")
    .get(getMonthlyReport);

router.route("/:id")
    .get(getReport)
    .put(updateReport)
    .delete(deleteReport);
    // if needed, add validateObjectId as first argument

module.exports = router;