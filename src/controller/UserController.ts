import {getConnection} from "typeorm";
import {ResultVo} from "../dto/ResultVo";
import {Question} from "../entity/Question";
import {User} from "../entity/User";
import {helper} from "../util/helper";

export class UserController {
  static getRooms = async (req, res) => {
    // pagination
    const {email, start_index, page_size} = req.query;

    const qb = getConnection().getRepository(Question)
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user');
    qb.where('room.id IN '
      + qb.subQuery().select('user.roomId')
        .from(User, 'user')
        .where('user.email = :email', {email: email}).getQuery())
        .setParameter(email, true)
      .orderBy('room.startdate', 'DESC')
    if (start_index) qb.skip(start_index)
    if (page_size) qb.take(page_size)

    const qb2 = await getConnection().getRepository(User)
      .createQueryBuilder('user')
      .select('COUNT(DISTINCT(`id`))', 'count')
      .where('email = :email', {email: email});

    const rooms = await qb.getMany();
    const total = await qb2.getRawOne();

    const result = new ResultVo(0, "success");
    result.data = rooms;
    result.total = parseInt(total.count);
    res.send(result);
  }

  static getRoom = async (req, res) => {
    console.log(req.params);
    const {id} = req.params;

    const options = {relations: ["users"], where: [{id}], take: 1};

    const room = await getConnection().getRepository(Question).findOne(options);
    res.send(room);
  }

  static addRoom = async (req, res) => {
    const {host_email, name, desc, startdate, hour, secrete, password, video_host, video_guest, option_host,
      option_mic, option_record, users} = req.body;

    const newRoom = new Question();
    newRoom.id = helper.getUuid();
    newRoom.host_email = host_email;
    newRoom.name = name;
    newRoom.desc = desc;
    newRoom.startdate = startdate;
    newRoom.hour = hour;
    newRoom.secrete = secrete;
    if (password) {
      newRoom.password = password;
    }
    newRoom.video_host = video_host;
    newRoom.video_guest = video_guest;
    newRoom.option_host = option_host;
    newRoom.option_mic = option_mic;
    newRoom.option_record = option_record;
    await getConnection().getRepository(Question).save(newRoom);

    if (users && users.length > 0) {
      const newUsers = users.map(user => {
        const u = new User();
        u.email = user.email;
        u.name = user.name;
        u.room = newRoom;  // relation key
        return u;
      })
      // bulk insert
      await getConnection().createQueryBuilder().insert().into(User).values(newUsers).execute();
    }

    res.send(new ResultVo(0, 'success'));
  }

  static modifyRoom = async (req, res) => {
    const {id} = req.params;
    const {host_email, name, desc, startdate, hour, secrete, password, video_host, video_guest, option_host,
      option_mic, option_record, users} = req.body;

    const updateOption = {};
    if (host_email) updateOption['host_email'] = host_email;
    if (name) updateOption['name'] = name;
    if (desc) updateOption['desc'] = desc;
    if (startdate) updateOption['startdate'] = startdate;
    if (password) updateOption['password'] = password;
    if (hour) updateOption['hour'] = hour;
    if (secrete) updateOption['secrete'] = secrete;
    updateOption['video_host'] = !!video_host;
    updateOption['video_guest'] = !!video_guest;
    updateOption['option_host'] = !!option_host;
    updateOption['option_mic'] = !!option_mic;
    updateOption['option_record'] = !!option_record;

    // Question update
    await getConnection().createQueryBuilder().update(Question)
        .set(updateOption)
        .where("id = :id", {id})
        .execute()

    if (users && users.length > 0) {
      // delete old users
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("roomId = :id", {id})
        .execute();

      // insert users
      const room = new Question();
      room.id = id;
      const newUsers = users.map(user => {
        const u = new User();
        u.email = user.email;
        u.name = user.name;
        u.room = room;  // relation key
        return u;
      })
      // bulk insert
      await getConnection().createQueryBuilder().insert().into(User).values(newUsers).execute();
    }

    const result = new ResultVo(0, 'success');
    res.send(result);
  }

  static removeRoom = async (req, res) => {
    console.log(req);
    const {id} = req.query;

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Question)
        .where("id = :id", { id })
        .execute();

    const result = new ResultVo(0, "success");
    res.send(result);
  }

  static addUser = async (req, res) => {
    const {id} = req.params;
    const {email, name} = req.body;

    const options = {relations: ["users"], where: [{id}], take: 1};
    const room = await getConnection().getRepository(Question).findOne(options);
    const oldUser = room.users.find(user => user.email === email);

    if (oldUser) {
      const result = new ResultVo(100, "등록된 이메일입니다.");
      res.send(result);
    } else {

      const room = new Question();
      room.id = id;
      const newUser = new User();
      newUser.email = email;
      newUser.name = name;
      newUser.room = room;  // relation key
      await getConnection().getRepository(User).save(newUser);

      const result = new ResultVo(0, "등록되었습니다.");
      res.send(result);
    }
  }

  static checkPassword = async (req, res) => {
    const {id, password} = req.query;
    console.log(id, password);

    await getConnection().getRepository(Question).findOne();

    const queryList = await getConnection()
      .getRepository(Question)
      .createQueryBuilder()
      .where("room.id = :id and room.password = :password", {id, password})
      .execute();
    // console.log(result); 배열로 리턴

    if (queryList.length > 0) {
      const result = new ResultVo(0, "success");
      res.send(result);
    } else {
      const result = new ResultVo(100, "패스워드가 맞지 않습니다.");
      res.send(result);
    }
  }
}