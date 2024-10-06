import { Dialect, Sequelize } from 'sequelize';

const DB_NAME=process.env.DB_NAME!;
const DB_USER=process.env.DB_USER!;
const DB_PASSWORD=process.env.DB_PASSWORD!;
const DB_HOST=process.env.DB_HOST!;
const DB_PORT=parseInt(process.env.DB_PORT!);

export const database = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: 'mysql',
        port: DB_PORT,
    }
);

async function generateDb() {
    await database.sync();
    console.log('Base de datos y tablas creadas');
}

generateDb();