import { Request, Response, NextFunction } from 'express';
import { ApiError} from '../errors/Api.error';

export class ApiErrorHandlerMiddleware {
    public errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
        if (error instanceof ApiError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}