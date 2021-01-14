import {ResultVo} from "../dto/ResultVo";

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
    const result = new ResultVo(0, "success");
    res.send(result);
  }
}