import {Router} from 'express';
import {QuestionController} from "../controller/QuestionController";
import {UserController} from "../controller/UserController";

const routes = Router();

routes.get('/chapter_id/:chapter_id', QuestionController.getQuestionByChapterId);
routes.get('/id', QuestionController.getQuestionById);

export default routes;