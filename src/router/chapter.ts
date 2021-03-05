import {Router} from "express";
import {ChapterController} from "../controller/ChapterController";

const routes = Router();

routes.get('/textbook_id/:textbook_id', ChapterController.getChapterByTextbookId);
routes.get('/detail/:id', ChapterController.getChapter);
routes.post('', ChapterController.addChapter);

export default routes;