import {Router} from "express";
import {UnAuthController} from "../controller/UnAuthController";

const routes = Router();

routes.post('/login', UnAuthController.login);
routes.post('/signUp', UnAuthController.signUp);

export default routes;