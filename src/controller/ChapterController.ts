import {getConnection} from "typeorm";
import {Chapter} from "../entity/Chapter";
import {Textbook} from "../entity/Textbook";
import {ResultVo} from "../dto/ResultVo";

export class ChapterController {
  static getChapterByTextbookId = async (req, res) => {
    const {textbook_id} = req.params;
    const db = getConnection().getRepository(Chapter)
      .createQueryBuilder('chapter')
      .where('chapter.textbookId = :textbook_id', {textbook_id})

    const chapters = await db.getMany();

    res.send(chapters);
  }

  static getChapter = async (req, res) => {
    const {id} = req.params;
    const db = getConnection().getRepository(Chapter)
      .createQueryBuilder('chapter')
      .where('chapter.id = :id', {id})

    const chapter = await db.getOne();

    res.send(chapter);
  }

  static addChapter = async (req, res) => {
    const chapter = req.body;
    const {textbookId} = req.body;
    await getConnection().createQueryBuilder()
      .insert()
      .into(Chapter)
      .values(chapter)
      .execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }
}