import {Router} from "express";
import {UnAuthController} from "../controller/UnAuthController";

const routes = Router();

routes.get('/login', UnAuthController.login);
routes.post('/signUp', UnAuthController.signUp);

export default routes;