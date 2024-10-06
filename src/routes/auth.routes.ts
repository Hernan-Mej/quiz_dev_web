import { Application } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoutes{
    private authController = new AuthController();

    public routes(app: Application){
        app.route('/register').post(this.authController.register);
        app.route('/login').post(this.authController.login);
    }
}