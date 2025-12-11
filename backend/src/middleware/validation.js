import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  // If there are validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  // If ok → proceed
  next();
};

export default validate;
