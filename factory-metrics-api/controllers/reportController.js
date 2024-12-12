const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");
const { default: mongoose } = require("mongoose");
const { json } = require("express");

const getAllReports = asyncHandler( async (req, res) => {

    const reports = await Report.find();
    res.status(200).json(reports);

});

const getReport = asyncHandler( async (req, res, next) => {

    const report = await Report.findById(req.params.id);

    if (!report) {
        const error = new Error("Report not found.");
        res.status(404);
        return next(error);
    }

    res.status(200).json(report);

});

const getMonthlyReport = asyncHandler( async (req, res, next) => {

    const { year, month } = req.params;
    const { product_id } = req.query;

    if (!year || !month || isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        res.status(400);
        throw new Error("Invalid year or month.");
    }

    const startDate = new Date(year, month-1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const query = {
        date: {
            $gte: startDate,
            $lte: endDate
        }
    };

    if (product_id) {
        query.product_id = product_id;
    }

    try {
        const reports = await Report.find(query);

        if (!reports.length) {
            res.status(404);
            throw new Error("No reports found for the specified criteria.");
        }

        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
    
})

const createReport = asyncHandler( async (req,res) => {

    const { product_id, quantity, date, remarks } = req.body;

    if ( !product_id || !quantity || !date ) {
        res.status(400);
        throw new Error("Product, quantity and date are mandatory");
    }

    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime())){
        res.status(400);
        throw new Error("Invalid date format.");
    }

    inputDate.setUTCHours(0, 0, 0, 0);

    const foundReport = await Report.findOne({
        product_id,
        date: inputDate
    });

    if (foundReport) {
        res.status(400);
        throw new Error("Report already registered for this product and day. Update the record if needed.");
    }

    const report = await Report.create({
        product_id,
        quantity,
        date,
        remarks,
        created_by_user_id: req.user.id
    });

    if (report) {
        res.status(201).json({
            _id: report.id,
        });
    } else {
        res.status(400);
        throw new Error("Report data is not valid.");
    }

    res.json({ message: "Report registered."});

});

const updateReport = asyncHandler( async (req, res) => {

    const foundReport = await Report.findById(req.params.id);

    if (!foundReport) {
        req.status(404)
        throw new Error("Report not found.");
    }

    const updatedReport = await Report.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updatedReport);

});

const deleteReport = asyncHandler( async (req,res) => {

    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error("Report not found.");
    }

    res.status(200).json({ message: `Deleted report of id ${req.params.id}.`});
    
});

module.exports = { getAllReports, getReport, getMonthlyReport, createReport, updateReport, deleteReport}