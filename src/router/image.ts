import {Router} from 'express';
import {ImageController} from "../controller/ImageController";

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

const routes = Router();

routes.post('/upload', upload.single('chat-image'), ImageController.uploadImage);
routes.get('/download/:id', ImageController.downloadImage);

export default routes;