import {ResultVo} from "../dto/ResultVo";
import {getConnection} from "typeorm";
import {Question} from "../entity/Question";
import {Answer} from "../entity/Answer";

export class QuestionController {
  static getQuestion = async (req, res) => {
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
        .where('question.categoryId = :category_id', {chapter_id})

    const questions = await db.getRawMany();

    res.send(questions);
  }
}