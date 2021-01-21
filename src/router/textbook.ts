import {Router} from "express";
import {TextbookController} from "../controller/TextbookController";

const routes = Router();

routes.get('', TextbookController.getTextBook);
routes.post('', TextbookController.addTextbook);

export default routes;