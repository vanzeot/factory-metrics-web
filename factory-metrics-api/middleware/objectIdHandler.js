const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    
    res.status(404);
    return next(new Error("Item not found."));
  }
  next();
};

module.exports = validateObjectId;
