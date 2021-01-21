import {Router} from 'express';
import {QuestionController} from "../controller/QuestionController";

const routes = Router();

routes.get('/chapter_id/:chapter_id', QuestionController.getQuestionByChapterId);

export default routes;