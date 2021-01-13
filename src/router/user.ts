import {Router} from 'express';
import {UserController} from "../controller/UserController";

const routes = Router();

routes.get('/rooms', UserController.getRooms);

routes.get('/room/:id', UserController.getRoom);

routes.post('/room', UserController.addRoom);

routes.delete('/room', UserController.removeRoom);

routes.put('/room/:id', UserController.modifyRoom);

routes.post('/room/user/:id', UserController.addUser);

routes.get('/password', UserController.checkPassword);

export default routes;