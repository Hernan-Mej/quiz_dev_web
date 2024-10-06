import { UserController } from "../controllers/User.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
import { Application } from "express";

export class UserRoutes {
    private userController = new UserController();
    private authMiddleware = new AuthMiddleware();

    public routes(app: Application): void {
        app.route('/users')
            .get(this.authMiddleware.verifyToken,this.userController.getUsers);
    }
}