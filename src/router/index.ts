import {Router} from "express";
import user from './user';
import textbook from './textbook';
import chapter from './chapter';
import question from './question';
import answer from './answer';
import unauth from './unauth';
import chat from './chat';
import jwtUtils from "../utils/jwtUtils";

const routes = Router();

routes.use('/unauth', unauth);
routes.use('/user', jwtUtils.verifyToken, user);
routes.use('/textbook', jwtUtils.verifyToken, textbook);
routes.use('/chapter', jwtUtils.verifyToken, chapter);
routes.use('/question', jwtUtils.verifyToken, question);
routes.use('/answer', jwtUtils.verifyToken, answer);
routes.use('/chat', jwtUtils.verifyToken, chat);

export default routes;