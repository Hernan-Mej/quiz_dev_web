import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import { User } from './User';
import { Role } from './role';
import { ApiError } from '../errors/Api.error';

export class Event extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public location!: string;
    public date!: Date;
    public capacity!: number;
    public userId!: number;
}

export interface EventI {
    title: string;
    description: string;
    location: string;
    capacity: number;
    date: Date;
}

Event.init(
    {
        title: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: new DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: new DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'events',
        sequelize: database,
        timestamps: false,
        hooks: {
            async beforeCreate(event) {
                if(event.capacity <= 0){
                    throw new ApiError('The capacity must be greater than 0');
                }

                if(event.date < new Date()){
                    throw new ApiError('The date must be greater than the current date');
                }
            }
        }
    }
);