import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';

class Api {
  app: Express;
  started: boolean = false;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(routes);
  }

  start(): void {
    if (this.started) {
      return;
    }

    this.app.listen('8080', () => {
      console.log('Server listening on port 8080');
    });

    this.started = true;
  }
}

export const API = new Api();
