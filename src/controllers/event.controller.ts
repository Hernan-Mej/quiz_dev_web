import { Request, Response, NextFunction} from 'express';
import { Event, EventI } from '../models/Event';
import { User, UserI } from '../models/User';
import { Registration } from '../models/Registrations';

export class EventController {
    public async getEvents(req: Request, res: Response, next: NextFunction){
        try {
            const events = await Event.findAll();
            res.json(events);
        } catch (error) {
            next(error);
        }
    }

    public async createEvent(req: Request, res: Response, next: NextFunction){
        try {
            if(req.headers['roleId'] !== '2'){
                res.status(403).json({message: 'Unauthorized'});
                return;
            }

            const event = req.body as EventI;
            if(!event.title || !event.date || !event.description 
                || !event.capacity || !event.location){
                res.status(400).json({message: 'Missing fields'});
                return;
            }

            const newEvent = await Event.create({...event});
            res.json(newEvent);
        } catch (error) {
            next(error);
        }
    }

    public async updateEvent(req: Request, res: Response, next: NextFunction){
        try {
            if(req.headers['roleId'] !== '2'){
                res.status(403).json({message: 'Unauthorized'});
                return;
            }

            const {id} = req.params;
            const updateEvent = req.body as EventI;
            if(!updateEvent.title || !updateEvent.date || !updateEvent.description 
                || !updateEvent.capacity || !updateEvent.location){
                res.status(400).json({message: 'Missing fields'});
                return;
            }

            const event = await Event.findByPk(id);
            if(!event){
                res.status(404).json({message: 'Event not found'});
                return;
            }

            const updatedEvent = await Event.update({...updateEvent}, {where: {id: id}});
            res.json(updatedEvent);
        } catch (error) {
            next(error);
        }
    }

    public async deleteEvent(req: Request, res: Response, next: NextFunction){
        try {
            if(req.headers['roleId'] !== '2'){
                res.status(403).json({message: 'Unauthorized'});
                return;
            }

            const {id} = req.params;
            const event = await Event.findByPk(id);
            if(!event){
                res.status(404).json({message: 'Event not found'});
                return;
            }

            const deletedEvent = await Event.destroy({where: {id: id}});
            res.json(deletedEvent);
        } catch (error) {
            next(error);
        }
    }

    public async registerEvent(req: Request, res: Response, next: NextFunction){
        try {
            const roleId = req.headers['roleId'];
            if(roleId !== '3'){
                res.status(403).json({message: 'Unauthorized'});
                return;
            }

            const {id} = req.params;
            const userId = req.headers['userId'];

            await Registration.create({
                eventId: id,
                userId: userId
            });

            res.json({message: 'Registered successfully'});
        } catch (error) {
            next(error);
        }
    }

    public async getRegistrations(req: Request, res: Response, next: NextFunction){
        try {
            const roleId = req.headers['roleId'];
            if(roleId !== '2'){
                res.status(403).json({message: 'Unauthorized'});
                return;
            }

            const {id} = req.params;
            const event = await Event.findByPk(id);
            if(!event){
                res.status(404).json({message: 'Event not found'});
                return;
            }

            const registrations = await Registration.findAll({ where: { eventId: id } });
            const userIds = registrations.map(registration => registration.userId);
            const users = await User.findAll({ where: { id: userIds } }) as UserI[];
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
}