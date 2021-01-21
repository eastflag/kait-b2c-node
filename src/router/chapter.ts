import {Router} from "express";
import {ChapterController} from "../controller/ChapterController";

const routes = Router();

routes.get('/chapter', ChapterController.getChapter);
routes.post('/chapter', ChapterController.addChapter);

export default routes;