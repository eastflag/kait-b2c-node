import {getConnection} from "typeorm";
import {Textbook} from "../entity/Textbook";
import {ResultVo} from "../dto/ResultVo";

export class TextbookController {
  static getTextBook = async (req, res) => {
    const db = getConnection().getRepository(Textbook)
      .createQueryBuilder('textbook')

    const textbooks = await db.getMany();

    res.send(textbooks);
  }

  static addTextbook = async (req, res) => {
    const textbook = req.body;
    await getConnection().createQueryBuilder()
      .insert()
      .into(Textbook)
      .values(req.body)
      .execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }
}