import { Request, Response, NextFunction } from 'express';
import { globalErrorHandler } from '../../src/middlewares/errorHandler';

describe('Global Error Handler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence console.error in tests
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.NODE_ENV;
  });

  it('should return 500 and hide stack trace in production', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Secret DB crash');

    globalErrorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error'
    });
  });

  it('should return 500 and include stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Secret DB crash');

    globalErrorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Secret DB crash',
      stack: error.stack
    });
  });

  it('should respect custom status codes on the error object', () => {
    process.env.NODE_ENV = 'development';
    const error: any = new Error('Not Found');
    error.status = 404;

    globalErrorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not Found' }));
  });
});
