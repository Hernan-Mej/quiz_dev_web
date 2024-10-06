import { EventController } from "../controllers/event.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";
import { Application } from "express";

export class EventRoutes {
    private eventController = new EventController();
    private authMiddleware = new AuthMiddleware();

    public routes(app: Application): void {
        app.route('/events')
            .get(this.authMiddleware.verifyToken,this.eventController.getEvents)
            .post(this.authMiddleware.verifyToken, this.eventController.createEvent);
        
        app.route('/events/:id')
            .put(this.authMiddleware.verifyToken,this.eventController.updateEvent)
            .delete(this.authMiddleware.verifyToken,this.eventController.deleteEvent);
        
        app.route('/events/:id/register')
            .post(this.authMiddleware.verifyToken,this.eventController.registerEvent);

        app.route('/events/:id/attendees')
            .get(this.authMiddleware.verifyToken,this.eventController.getRegistrations);
    }
}