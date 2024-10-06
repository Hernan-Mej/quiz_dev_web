import { Application } from "express";
import { AuthRoutes } from "./auth.routes";
import { UserRoutes } from "./user.routes";
import { EventRoutes } from "./event.routes";

export class Routes {
    private authRoutes: AuthRoutes = new AuthRoutes();
    private userRoutes: UserRoutes = new UserRoutes();
    private eventRoutes: EventRoutes = new EventRoutes();

    public routes(app: Application){
        this.authRoutes.routes(app);
        this.userRoutes.routes(app);
        this.eventRoutes.routes(app);
    }
}
