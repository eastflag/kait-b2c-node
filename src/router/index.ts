import {Router} from "express";
import user from './user';
import question from './question';

const routes = Router();

routes.use('/user', user);

routes.use('/question', question);

export default routes;