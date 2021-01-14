import {Router} from 'express';
import {QuestionController} from "../controller/QuestionController";

const routes = Router();

routes.get('/:category_id', QuestionController.getQuestion);

export default routes;