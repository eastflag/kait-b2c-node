import {Router} from 'express';
import {QuestionController} from "../controller/QuestionController";

const routes = Router();

routes.get('/question', QuestionController.getQuestion);

export default routes;