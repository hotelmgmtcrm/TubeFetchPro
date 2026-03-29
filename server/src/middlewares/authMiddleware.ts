import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as { id: string; role: string };
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as admin' });
  }
};
