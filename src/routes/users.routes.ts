import { Router } from 'express';
import UserController from '../controllers/UserController';
import { cpfValidator, createUser } from './provider';

const usersRouter = Router();

const userController = new UserController(createUser, cpfValidator);

usersRouter.post('/', (req, res) => userController.create(req, res));

export default usersRouter;
