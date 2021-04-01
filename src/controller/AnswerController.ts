import {getManager} from "typeorm";

export class AnswerController {
  static getChapterResult = async (req, res) => {
    const {chapter_id} = req.params;

    const entityManager = getManager();
    const rawData = await entityManager.query(`
      select count(*) as 'total', IFNULL(sum(score), 0) as 'score' from answer
      where questionId in (
        select id from question
        where chapterId = ${chapter_id})
    `);

    const [rawDataJson] = rawData;
    res.send(rawDataJson);
  }
}