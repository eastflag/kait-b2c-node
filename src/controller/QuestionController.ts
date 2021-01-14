import {ResultVo} from "../dto/ResultVo";

export class QuestionController {
  static getQuestion = async (req, res) => {

    const result = new ResultVo(0, "success");
    res.send(result);
  }
}