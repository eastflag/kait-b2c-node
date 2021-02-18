import {Router} from 'express';
import {ChatController} from "../controller/ChatController";

const routes = Router();

routes.get('/chatHistory', ChatController.getChatHistory);

export default routes;