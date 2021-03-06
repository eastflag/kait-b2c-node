import {getConnection} from "typeorm";
import {Textbook} from "../entity/Textbook";
import {ResultVo} from "../dto/ResultVo";

export class TextbookController {
  static getTextBook = async (req, res) => {
    const {id} = req.params;

    const db = getConnection().getRepository(Textbook)
      .createQueryBuilder('textbook')
      .where('textbook.id = :id', {id})

    const textbook = await db.getOne();
    // console.log(textbook);

    res.send(textbook);
  }

  static getTextBooks = async (req, res) => {
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
      .values(textbook)
      .execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }
}