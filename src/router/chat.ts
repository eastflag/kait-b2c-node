import {Router} from 'express';
import {ChatController} from "../controller/ChatController";

const routes = Router();

routes.get('/chatHistory', ChatController.getChatHistory);
routes.get('/roomsOfUser', ChatController.getRoomsOfUser);
routes.get('/roomsOfTeacher', ChatController.getRoomsOfTeacher);
routes.put('/leaveRoom', ChatController.leaveRoom);
routes.put('/chatHistory', ChatController.setClearChatHistory);

export default routes;