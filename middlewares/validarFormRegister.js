const { body, validationResult } = require('express-validator');

const validateFormRegister = [
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener como mínimo 8 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("register", { mensajeError:errors.mapped()});
        }
        next();
    }
];
module.exports = {
    validateFormRegister
};
