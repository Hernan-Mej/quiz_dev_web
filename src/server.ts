import env from 'dotenv';
env.config();
import { App } from './config/index';
import { Role, Roles } from './models/role';

async function main() {
    const app = new App(4000);
    await app.listen();

    /*
        Fragmento de codigo para inicializar los roles
        Ejecutar solo despues de que se creen las tablas
        Tambien se pueden crear los roles desde la api
        O desde la propia base de datos
    */
    // const rolesCount = await Role.count();
    // if (rolesCount === 0) {
    //     await Role.bulkCreate([
    //         { name: Roles.ADMIN },
    //         { name: Roles.ORGANIZER },
    //         { name: Roles.ASSISTANT }
    //     ]);
    //     console.log('Roles inicializados');
    // }
}

main();