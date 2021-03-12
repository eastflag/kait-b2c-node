import {getConnection, getManager} from "typeorm";
import {Image} from "../entity/Image";
import {ResultVo} from "../dto/ResultVo";

export class ImageController {
  static uploadImage = async (req, res) => {
    // console.log(req.file);
    // console.log(String(req.file.buffer))
    // const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const dataBinary = req.file.buffer;
    // console.log(datauri);

    let imageVo: Image = new Image();
    imageVo.data = dataBinary;
    imageVo.originalname = req.file.originalname;
    imageVo.mimetype = req.file.mimetype;

    await getConnection().createQueryBuilder()
      .insert()
      .into(Image)
      .values(imageVo)
      .execute();

    const resultVo = new ResultVo(0, 'success');
    resultVo.data = imageVo.id;
    res.send(resultVo);
  }

  static downloadImage = async (req, res) => {
    const {id} = req.params;
    const db = getConnection()
      .getRepository(Image)
      .createQueryBuilder('image')
      .where('image.id = :id', {id})
    const result = await db.getOne();

    // console.log(result.data);
    // const img = Buffer.from(result.data, 'base64');
    // console.log(img);
    // console.log(img.length);

    res.writeHead(200, {
      'Content-Type': result.mimetype,
      'Content-Length': result.data.length
    });

    res.end(result.data);
  }
}