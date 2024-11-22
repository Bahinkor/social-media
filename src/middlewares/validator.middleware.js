const validatorMiddleware = schema => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, {
                abortEarly: false
            });
            next();

        } catch (err) {
            if (err.isJoi) return res.status(422).json(err.details);

            res.status(500).json({
                message: err.message || "internal server error.",
            });
        }
    };
};

module.exports = validatorMiddleware;