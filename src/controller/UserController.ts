import {ResultVo} from "../dto/ResultVo";
import {Answer} from "../entity/Answer";
import {User} from "../entity/User";
import {getConnection, getManager} from "typeorm";
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
import jwtOptions from '../config/jwtOptions';
import {ChannelHistory} from "../entity/ChannelHistory";
import {Textbook} from "../entity/Textbook";

export class UserController {
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
                where answer.userId = ${userId} and answer.questionId in (select question.id from question where question.chapterId in 
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
    // console.log(answerList);

    await getConnection().createQueryBuilder().insert().into(Answer).values(answerList).execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }

  static getChapterResult = async (req, res) => {
    const {userId} = req.query
    const {chapter_id} = req.params;

    const entityManager = getManager();
    const rawData = await entityManager.query(`
      select A.*, Q.name from answer A inner join question Q on A.questionId = Q.id
      where A.userId = ${userId} and Q.chapterId = ${chapter_id}
    `);

    res.send(rawData);
  }

  static saveChannelHistory = async (req, res) => {
    const {userId, questionId, type} = req.query;

    await getConnection().createQueryBuilder().insert().into(ChannelHistory).values({userId, questionId, type}).execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }

  static getProfile = async (req, res) => {
    const {id} = req.query;
    const db = getConnection().getRepository(User)
      .createQueryBuilder('user')
      .where('id = :id', {id})

    const profile = await db.getOne();
    res.send(profile);
  }

  static modifyProfile = async (req, res) => {
    const {id, name} = req.body;

    const updateOption = {};
    if (name) {
      updateOption['name'] = name;
    }

    const result = await getConnection().createQueryBuilder().update(User)
      .set(updateOption)
      .where("id = :id", {id})
      .execute();

    res.send(result);
  }

  static modifyPassword = async (req, res) => {
    const {id, password} = req.body;

    const updateOption = {};
    if (password) {
      updateOption['password'] = password;
    }

    const result = await getConnection().createQueryBuilder().update(User)
      .set(updateOption)
      .where("id = :id", {id})
      .execute();

    res.send(result);
  }
}