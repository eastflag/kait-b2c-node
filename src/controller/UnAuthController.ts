import {ResultVo} from "../dto/ResultVo";
import jwtOptions from "../config/jwtOptions";
import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {Textbook} from "../entity/Textbook";
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

export class UnAuthController {
  static login = async (req, res) => {
    const {email, password} = req.body;
    const db = getConnection().getRepository(User)
      .createQueryBuilder('user')
      .where('email = :email and password = :password', {email, password});

    const user = await db.getOne();
    console.log(user);

    if (user) {
      const payload = {
        id: user.id,
        email: email
      }
      const result = new ResultVo(0, "success");
      result.data = {
        token: jwt.sign(payload, jwtOptions.secretKey, jwtOptions.options),
        refreshToken: randToken.uid(256)
      }
      res.send(result);
    } else {
      res.send(new ResultVo(100, "email and password do not match"));
    }
  }

  static signUp = async (req, res) => {
    const {email, password} = req.body;

    try {
      const user =await getConnection().getRepository(User)
        .createQueryBuilder('user')
        .where('email = :email', {email})
        .getOne();
      console.log(user);
      if (user) {
        res.send(new ResultVo(100, "email exists"));
      } else {
        await getConnection().createQueryBuilder()
          .insert()
          .into(User)
          .values({email, password})
          .execute();
        const result = new ResultVo(0, "success");
        res.send(result);
      }
    } catch(err) {
      res.send(new ResultVo(100, err.message));
    }
  }
}