const errorMiddleware = (err, req, res, next) => {
    try {
        let statusCode = err.statusCode || 500;
        let message = err.message || "Internal Server Error";

        console.error(err);

        if (err.code === 11000) {
            statusCode = 400;
            const field = Object.keys(err.keyValue || {})[0];
            message = field
                ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
                : "Duplicate key error";
        }

        if (err.name === "CastError") {
            statusCode = 400;
            message = `Invalid ${err.path}: ${err.value}`;
        }

        if (err.name === "ValidationError") {
            statusCode = 400;
            message = Object.values(err.errors)
                .map((e) => e.message)
                .join(", ");
        }

        if (err.name === "JsonWebTokenError") {
            statusCode = 401;
            message = "Invalid token. Please log in again";
        }

        if (err.name === "TokenExpiredError") {
            statusCode = 401;
            message = "Your token has expired. Please log in again";
        }

        res.status(statusCode).json({
            success: false,
            statusCode,
            message,
        });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
