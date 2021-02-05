import {ResultVo} from "../dto/ResultVo";
import {getConnection, getManager} from "typeorm";
import {Question} from "../entity/Question";
import {Answer} from "../entity/Answer";

export class QuestionController {
  static getQuestionByChapterId = async (req, res) => {
    const {userId} = req.query;
    const {chapter_id} = req.params;

    const db = getConnection().getRepository(Question)
        .createQueryBuilder('question')
        .select(['question.id as id', 'question.name as name', 'question.examples as examples',
          'question.equations as equations', 'question.answers as answers'])
        .addSelect(subQuery => {
          return subQuery.select('answer.answer')
              .from(Answer, 'answer')
              .where('answer.userId = :userId and answer.questionId = question.id', {userId: userId})
        }, 'userAnswers')
        .where('question.chapterId = :chapter_id', {chapter_id})

    const questions = await db.getRawMany();

    res.send(questions);
  }


  static getQuestionById = async (req, res) => {
    const {questionId} = req.query

    const entityManager = getManager();
    const rawData = await entityManager.query(`
        select t.code, t.semester, q.page_number, q.name
        from textbook t inner join chapter c on t.id = c.textbookId
            inner join question q on c.id = q.chapterId
        where q.id = ${questionId};
    `);

    res.send(rawData);
  }
}