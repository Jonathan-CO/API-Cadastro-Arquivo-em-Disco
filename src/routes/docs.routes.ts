import { Router } from 'express';

import DocsController from '../controllers/DocsController';
import { auth, generateDocUser } from './provider';

const docsRouter = Router();

const docsController = new DocsController(generateDocUser);

docsRouter.post(
  '/',
  (req, res, next) => auth.isValid(req, res, next),
  (req, res) => docsController.create(req, res),
);

export default docsRouter;
