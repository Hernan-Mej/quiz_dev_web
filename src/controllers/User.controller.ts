import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export class UserController {
    public async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const roleId = req.headers['roleId'];
            if (roleId !== '1') {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }

            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
}