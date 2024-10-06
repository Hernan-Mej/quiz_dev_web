import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { User } from './User';
import { Event } from './Event';
import { Role } from './role';
import { ApiError } from '../errors/Api.error';

export class Registration extends Model {
    public userId!: number;
    public eventId!: number;
}

export interface RegistrationI {
    userId: number;
    eventId: number;
}

Registration.init(
    {
        userId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        },
        eventId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'registrations',
        sequelize: database,
        timestamps: false,
        hooks: {
            async beforeCreate(registration) {
                const user = await User.findByPk(registration.userId);
                const event = await Event.findByPk(registration.eventId);

                if(user === null || event === null){
                    throw new ApiError('User or event not found');
                }

                const registrations = await Registration.findAll(
                    {
                        where: {eventId: event.id}
                    }
                );

                if(registrations.length >= event.capacity){
                    throw new ApiError('Event is full');
                }

                const rol = await Role.findByPk(user.roleId);
                if(registrations.some(r => r.userId === user.id) && rol?.name == 'assistant'){
                    throw new ApiError('User is already registered');
                }

                if(event.date < new Date() && rol?.name == 'assistant'){
                    throw new ApiError('The event has already happened');
                }
            }
        }
    }
);

User.belongsToMany(Event, { through: Registration, foreignKey: 'userId' });
Event.belongsToMany(User, { through: Registration, foreignKey: 'eventId' });