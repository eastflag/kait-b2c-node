import {getConnection} from "typeorm";
import {Question} from "../entity/Question";
import {Answer} from "../entity/Answer";

export class ChapterController {
  static getChapter = async (req, res) => {
    const db = getConnection().getRepository(Question)
      .createQueryBuilder('textbook')

    const textbooks = await db.getMany();

    res.send(textbooks);
  }

  static addChapter = async (req, res) => {
    res.send({});
  }
}