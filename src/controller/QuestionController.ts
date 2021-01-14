import {ResultVo} from "../dto/ResultVo";
import {getConnection} from "typeorm";
import {Question} from "../entity/Question";

export class QuestionController {
  static getQuestion = async (req, res) => {
    const {category_id} = req.params;

    const db =getConnection().getRepository(Question)
        .createQueryBuilder('question')
        .where('question.categoryId = :category_id', {category_id})

    const questions = await db.getMany();

    res.send(questions);
  }
}