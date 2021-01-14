import {Router} from 'express';
import {UserController} from "../controller/UserController";

const routes = Router();

routes.get('/login', UserController.login);

routes.post('/signUp', UserController.signUp);

routes.post('/submitAnswer', UserController.submitAnswer);

export default routes;