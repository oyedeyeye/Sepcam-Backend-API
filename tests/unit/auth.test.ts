import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateRequest, AuthRequest } from '../../src/middlewares/auth';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header is present', () => {
    const req = { header: jest.fn().mockReturnValue(null) } as unknown as AuthRequest;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
  });

  it('should call next() if valid token is provided', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer valid-token'), user: null } as unknown as AuthRequest;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;

    (jwt.verify as jest.Mock).mockReturnValue({ id: 'user1' });

    authenticateRequest(req, res, next);
    expect(req.user).toEqual({ id: 'user1' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if token is invalid', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer invalid-token') } as unknown as AuthRequest;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
  });
});
