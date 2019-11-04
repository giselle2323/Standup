const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
    return [
        body('firstname').isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters'),
        body('lastname').isLength({ min: 5 }).withMessage('Lastname must not be less than 4 characters'),
        body('email').isEmail().withMessage("Email must be valid"),
        body('gender').isLength({ min: 4 }).withMessage("A Gender Must be choosen"),
        body('department').isLength({ min: 5 }).withMessage("A Department must be choosen"),
        body('role').isLength({ min: 4 }).withMessage("An Option must be selected"),
        body('password').isLength({ min: 5 }).withMessage("Password must not be less than 5 characters"),
    ]
   
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push( err.msg ))
    console.log(extractedErrors);
    req.flash("error", {message: extractedErrors });
    res.redirect("/users/create");
    // return res.status(422).json({
    //     errors: extractedErrors,
    // })
}

module.exports = {
    userValidationRules,
    validate,
}