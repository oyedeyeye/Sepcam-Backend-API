"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message || 'Unknown Error'}`);
    if (err.stack) {
        console.error(err.stack);
    }
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
exports.globalErrorHandler = globalErrorHandler;
