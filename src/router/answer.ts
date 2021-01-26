import {Router} from 'express';
import {AnswerController} from "../controller/AnswerController";

const routes = Router();

routes.get('/result/:chapter_id', AnswerController.getChapterResult);

export default routes;