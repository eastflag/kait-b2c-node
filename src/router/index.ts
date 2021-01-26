import {Router} from "express";
import user from './user';
import textbook from './textbook';
import chapter from './chapter';
import question from './question';
import answer from './answer';

const routes = Router();

routes.use('/user', user);
routes.use('/textbook', textbook);
routes.use('/chapter', chapter);
routes.use('/question', question);
routes.use('/answer', answer);

export default routes;