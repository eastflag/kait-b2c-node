import {ResultVo} from "../dto/ResultVo";
import jwtOptions from "../config/jwtOptions";
import {getConnection} from "typeorm";
import {User} from "../entity/User";
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

export class UnAuthController {
  static login = async (req, res) => {
    const payload = {
      id: 1,
      email: 'eastflag@gmail.com'
    }
    const result = new ResultVo(0, "success");
    result.data = {
      token: jwt.sign(payload, jwtOptions.secretKey, jwtOptions.options),
      refreshToken: randToken.uid(256)
    }
    res.send(result);
  }

  static signUp = async (req, res) => {
    await getConnection().createQueryBuilder()
      .insert()
      .into(User)
      .values(req.body)
      .execute();
    const result = new ResultVo(0, "success");
    res.send(result);
  }
}