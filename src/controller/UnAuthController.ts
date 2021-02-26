import {ResultVo} from "../dto/ResultVo";
import jwtOptions from "../config/jwtOptions";
import {getConnection, getManager} from "typeorm";
import {User} from "../entity/User";
import {Textbook} from "../entity/Textbook";
import {createDeflateRaw} from "zlib";
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
      const entityManager = getManager();
      const rawData = await entityManager.query(`
        select r.role_name from role r inner join user_role ur on r.id = ur.roleId
        where ur.userId = ${user.id};
      `);
      console.log(rawData); // [ TextRow { role_name: 'user' } ]
      const roles = rawData.map(role => role['role_name']);

      const payload = {
        id: user.id,
        email: email,
        name: user.name,
        roles
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
    const {email, name, password} = req.body;

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
          .values({email, name, password})
          .execute();
        const result = new ResultVo(0, "success");
        res.send(result);
      }
    } catch(err) {
      res.send(new ResultVo(100, err.message));
    }
  }
}