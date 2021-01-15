import {ResultVo} from "../dto/ResultVo";
import {Answer} from "../entity/Answer";
import {User} from "../entity/User";
import {getConnection} from "typeorm";

export class UserController {
  static login = async (req, res) => {

    const result = new ResultVo(0, "success");
    res.send(result);
  }

  static signUp = async (req, res) => {
    const result = new ResultVo(0, "success");
    res.send(result);
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