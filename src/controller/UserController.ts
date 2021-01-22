import {ResultVo} from "../dto/ResultVo";
import {Answer} from "../entity/Answer";
import {User} from "../entity/User";
import {getConnection, getManager} from "typeorm";

export class UserController {
  static login = async (req, res) => {

    const result = new ResultVo(0, "success");
    res.send(result);
  }

  static signUp = async (req, res) => {
    const result = new ResultVo(0, "success");
    res.send(result);
  }

  static getTextBook = async (req, res) => {
    const {userId} = req.query

    const entityManager = getManager();
    const rawData = await entityManager.query(`
        select t.*, 
            (select count(*) from question where question.chapterId in (select c.id from chapter c where c.textbookId = t.id)) as total_question,
            (select count(*) from answer
                where answer.userId = ${userId} and  answer.questionId in 
                    (select question.id from question where question.chapterId in (select chapter.id from chapter where chapter.textbookId = t.id))) as total_progress,
            (select sum(answer.score) from answer
                where answer.userId = 1 and answer.questionId in (select question.id from question where question.chapterId in 
                (select chapter.id from chapter where chapter.textbookId = t.id))) as total_score,
            (select answer.updated from answer
              where answer.userId = ${userId} and answer.questionId in (select question.id from question where question.chapterId in (select chapter.id from chapter where chapter.textbookId = t.id))
              order by answer.updated desc
              limit 1) as recent_date
        from textbook t
    `);

    res.send(rawData);
  }

  static submitAnswer = async (req, res) => {
    const {userId} = req.query
    const user = await getConnection().getRepository(User).findOne({id: userId});
    const dataList = req.body;

    const answerList = dataList.map(data => {
      const answer = new Answer();
      answer.questionId = data.questionId;
      answer.user= user;
      answer.answer = data.answer;
      answer.score = data.score
      return answer;
    })
    console.log(answerList);

    await getConnection().createQueryBuilder().insert().into(Answer).values(answerList).execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }
}