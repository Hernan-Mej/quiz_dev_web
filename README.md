# Quiz: API de gestión de eventos con múltiples asistentes

## Contexto
Debes construir una API para la gestión de eventos. En esta plataforma, los usuarios pueden crear eventos, y otros usuarios pueden registrarse como asistentes. El sistema debe incluir roles de usuarios, rutas protegidas, y la relación entre usuarios y eventos.

## Requisitos

### 1. Base de datos
Crea las siguientes tablas usando Sequelize:
- **Users**: Contendrá `id`, `name`, `email`, `password` (encriptada), y `role` (admin, organizer, assistant).
- **Events**: Contendrá `id`, `title`, `description`, `location`, `date`, y `capacity`. Cada evento es organizado por un usuario con el rol de "organizer".
- **Registrations**: Relaciona a los usuarios (asistentes) con los eventos a los que se han registrado, con los campos `user_id` y `event_id`.

### 2. Relaciones entre tablas
- Un **User** con el rol de "organizer" puede crear muchos **Events**.
- Un **Event** puede tener muchos **Users** registrados como asistentes, y un **User** puede asistir a muchos **Events** (relación muchos a muchos a través de **Registrations**).

### 3. Autenticación y roles
Los usuarios deben poder:
- **Registrarse**: Proporcionar un nombre, email, contraseña y rol. El rol por defecto será "assistant".
- **Iniciar sesión**: Obtener un token JWT para autenticarse en las rutas protegidas.
- **Roles**: Los usuarios pueden tener los roles de "admin", "organizer", o "assistant".
  - **Admin**: Puede ver todos los eventos y gestionar usuarios.
  - **Organizer**: Puede crear, editar y eliminar sus propios eventos.
  - **Assistant**: Puede ver y registrarse en eventos.

### 4. Rutas del sistema
#### Rutas públicas:
- `POST /auth/register`: Registra un nuevo usuario.
- `POST /auth/login`: Autentica un usuario y devuelve un token JWT.

#### Rutas protegidas:
- **Usuarios (admin)**:
  - `GET /users`: Lista todos los usuarios (solo para administradores).
- **Eventos**:
  - `GET /events`: Lista todos los eventos disponibles.
  - `POST /events`: Crea un nuevo evento (solo para organizadores).
  - `PUT /events/:id`: Actualiza un evento creado por el usuario autenticado (solo organizadores).
  - `DELETE /events/:id`: Elimina un evento creado por el usuario autenticado (solo organizadores).
- **Registro de asistentes**:
  - `POST /events/:id/register`: Permite a un usuario registrarse en un evento como asistente (solo usuarios con rol "assistant").
  - `GET /events/:id/attendees`: Lista a los asistentes registrados en un evento (solo para organizadores del evento).

### 5. Restricciones y validaciones
- Un evento solo puede ser creado por un usuario con el rol de "organizer".
- El `capacity` (capacidad) de un evento debe ser positivo.
- No se puede registrar a un evento si ya se ha alcanzado la capacidad máxima.
- Un asistente no puede registrarse más de una vez en el mismo evento.
- Un asistente solo puede registrarse en eventos futuros (no en eventos pasados).
- Valida que las fechas de los eventos sean fechas válidas en el futuro.

## Solución del Proyecto

Este proyecto implementa una API para la gestión de eventos con múltiples asistentes, siguiendo los requisitos y restricciones especificados. A continuación, se describe la estructura del proyecto y la funcionalidad de cada una de sus partes.

### Estructura del Proyecto
```
└── 📁Proyecto
    └── 📁src
        └── 📁config
            └── index.ts
        └── 📁controllers
            └── auth.controller.ts
            └── event.controller.ts
            └── User.controller.ts
        └── 📁database
            └── db.ts
        └── 📁errors
            └── Api.error.ts
        └── 📁middlewares
            └── ApiErrorHandler.middleware.ts
            └── Auth.middleware.ts
        └── 📁models
            └── Event.ts
            └── Registrations.ts
            └── role.ts
            └── User.ts
        └── 📁routes
            └── auth.routes.ts
            └── event.routes.ts
            └── index.routes.ts
            └── user.routes.ts
        └── server.ts
    └── .env
    └── .gitignore
    └── package-lock.json
    └── package.json
    └── README.md
    └── tsconfig.json
```

### Descripción de Carpetas y Archivos

#### `src/config/index.ts`
Este archivo configura la aplicación Express, incluyendo middlewares como `morgan` para el logging, `cors` para permitir solicitudes de diferentes orígenes, y `ApiErrorHandlerMiddleware` para manejar errores globales. También importa y configura las rutas definidas en `src/routes/index.routes.ts`.

#### `src/controllers/`
Esta carpeta contiene los controladores que manejan la lógica de negocio de la aplicación.

- **`auth.controller.ts`**: Maneja la autenticación de usuarios, incluyendo el registro y el inicio de sesión.
- **`event.controller.ts`**: Maneja la creación, actualización, eliminación y listado de eventos.
- **`User.controller.ts`**: Maneja la gestión de usuarios, incluyendo la obtención de la lista de usuarios (solo para administradores).

#### `src/database/db.ts`
Configura la conexión a la base de datos usando Sequelize y define las relaciones entre los modelos.

#### `src/errors/Api.error.ts`
Define una clase personalizada para manejar errores de la API.

#### `src/middlewares/`
Esta carpeta contiene los middlewares que se utilizan en la aplicación.

- **`ApiErrorHandler.middleware.ts`**: Maneja los errores que ocurren durante la ejecución de las rutas.
- **`Auth.middleware.ts`**: Verifica la autenticidad de los tokens JWT y protege las rutas que requieren autenticación.

#### `src/models/`
Esta carpeta contiene los modelos de Sequelize que representan las tablas de la base de datos.

- **`Event.ts`**: Define el modelo de eventos, incluyendo sus atributos y relaciones.
- **`Registrations.ts`**: Define el modelo de registros, que relaciona a los usuarios con los eventos a los que se han registrado.
- **`role.ts`**: Define el modelo de roles de usuario.
- **`User.ts`**: Define el modelo de usuarios, incluyendo sus atributos y relaciones.

#### `src/routes/`
Esta carpeta contiene las definiciones de las rutas de la API.

- **`auth.routes.ts`**: Define las rutas públicas para el registro e inicio de sesión de usuarios.
- **`event.routes.ts`**: Define las rutas para la gestión de eventos, incluyendo la creación, actualización, eliminación y registro de asistentes.
- **`index.routes.ts`**: Agrupa y configura todas las rutas de la aplicación.
- **`user.routes.ts`**: Define las rutas para la gestión de usuarios (solo accesibles por administradores).

#### `src/server.ts`
Este archivo es el punto de entrada de la aplicación. Inicializa la aplicación Express y configura el puerto en el que se ejecutará. También contiene un fragmento de código comentado para inicializar los roles en la base de datos.

#### `tsconfig.json`
Archivo de configuración de TypeScript que define las opciones de compilación del proyecto.

#### `package.json`
Archivo de configuración de npm que define las dependencias del proyecto y los scripts de ejecución.

#### `.gitignore`
Archivo que especifica los archivos y carpetas que deben ser ignorados por Git.

### Configuración de Variables de Entorno

El archivo `.env` contiene las variables de entorno necesarias para la configuración de la base de datos y otros parámetros de la aplicación. Asegúrate de definir correctamente estas variables antes de ejecutar la aplicación.

### Scripts de npm

- **`build`**: Compila el proyecto TypeScript.
- **`dev`**: Ejecuta la aplicación en modo de desarrollo usando `nodemon` y `ts-node`.
- **`test`**: Comando placeholder para ejecutar pruebas (actualmente no implementado).

### Dependencias Principales

- **`express`**: Framework web para Node.js.
- **`sequelize`**: ORM para Node.js.
- **`jsonwebtoken`**: Biblioteca para trabajar con tokens JWT.
- **`bcrypt`**: Biblioteca para encriptar contraseñas.
- **`dotenv`**: Carga variables de entorno desde un archivo `.env`.

Esta estructura modular y bien organizada facilita la escalabilidad y el mantenimiento del proyecto, asegurando que cada componente tenga una responsabilidad clara y definida.

## Instrucciones de Ejecución
Luego de clonar o descargar este repositorio, sigue los siguientes pasos para ejecutar la aplicación:

1. Instala las dependencias del proyecto ejecutando `npm install`.
2. Modifica el archivo `.env` con la configuración de tu base de datos y otras variables de entorno.
3. Ejecuta el comando `npm run dev` para iniciar la aplicación en modo de desarrollo.
4. Accede a la API a través de `http://localhost:4000` u otro puerto especificado en tu archivo `.env`.
5. Utiliza herramientas como Postman o Alguna extension de vscode para probar las rutas de la API.