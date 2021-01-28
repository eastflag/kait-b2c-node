import {Router} from 'express';
import {UserController} from "../controller/UserController";

const routes = Router();

routes.get('/getTextbook', UserController.getTextBook);
routes.post('/submitAnswer', UserController.submitAnswer);
routes.get('/result/chapter/:chapter_id', UserController.getChapterResult);

export default routes;