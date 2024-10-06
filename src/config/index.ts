import express, { Application } from 'express';
import morgan from 'morgan';
import { Routes } from '../routes/index.routes';
import cors from 'cors';
import { ApiErrorHandlerMiddleware } from '../middlewares/ApiErrorHandler.middleware';

export class App {
    app: Application;
    private router = new Routes();
    private ApiMiddleware = new ApiErrorHandlerMiddleware();


    constructor(
        private port?: number | string
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private settings() {
        this.app.set('port', this.port);
    }

    private middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(this.ApiMiddleware.errorHandler)
    }

    async listen() {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }

    private routes() {
        this.router.routes(this.app);
    }
}
