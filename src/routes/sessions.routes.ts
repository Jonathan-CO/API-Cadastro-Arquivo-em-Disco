import { Router } from 'express';
import SessionsController from '../controllers/SessionController';
import { createSession } from './provider';

const sessionsRouter = Router();

const sessionsController = new SessionsController(createSession);

sessionsRouter.post('/', (req, res) => sessionsController.create(req, res));

export default sessionsRouter;
