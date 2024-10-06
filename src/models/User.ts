import { Model, DataTypes } from 'sequelize';
import { database } from '../database/db';
import bcrypt from 'bcrypt';
import { Role } from './role';
import { ApiError } from '../errors/Api.error';

export class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public roleId!: number;
}

export interface UserI {
    name: string;
    email: string;
    password: string;
    roleId: number;
}

User.init(
    {
        name: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: new DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'users',
        sequelize: database,
        timestamps: false,
        hooks: {
            async beforeCreate(user) {
                if(user.password === undefined || user.password === ''){
                    throw new ApiError('Password is required');
                }

                user.password = await bcrypt.hash(user.password, 10);

                if(user.roleId === undefined || 0 >= user.roleId){
                    user.roleId = 2;
                }
            },
            async beforeUpdate(user) {
                if(user.password === undefined || user.password === ''){
                    throw new ApiError('Password is required');
                }

                if(user.changed('password')){
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    }
);

User.belongsTo(Role, { foreignKey: 'roleId' });