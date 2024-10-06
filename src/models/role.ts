import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';

export enum Roles{
    ADMIN = 'admin',
    ORGANIZER = 'organizer',
    ASSISTANT = 'assistant'
}

export class Role extends Model {
    public id!: number;
    public name!: string;
}

export interface RoleI {
    name: string;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: database,
        tableName: 'roles',
        timestamps: false
    }
);