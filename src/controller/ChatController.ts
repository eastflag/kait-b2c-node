import {getConnection, getManager} from "typeorm";
import {ChatHistory} from "../entity/ChatHistory";
import {RoomUser} from "../entity/RoomUser";
import {ChatDAO} from "../dao/ChatDAO";
import {ResultVo} from "../dto/ResultVo";
import {Question} from "../entity/Question";
import {Answer} from "../entity/Answer";

export class ChatController {
  static getChatHistory = async (req, res) => {
    const {questionId} = req.query;

    const db = getConnection().getRepository(ChatHistory)
      .createQueryBuilder('chat_history')
      .where('chat_history.questionId = :questionId', {questionId})

    const chatHistories = await db.getMany();
    return res.send(chatHistories);
  }

  static leaveRoom = async (req, res) => {
    const {questionId, userId, isJoined} = req.body;
    await ChatDAO.updateRoom({questionId, userId, isJoined})
    return res.send(new ResultVo(0, 'success'));
  }

  // 학생: 본인이 조인한 방 리스트
  static getRoomsOfUser = async (req, res) => {
    const {userId} = req.query;

    const entityManager = getManager();
    const rawData = await entityManager.query(`
      select RU.*,
             (select CH.roleName from chat_history CH where CH.questionId = RU.questionId 
               ORDER BY CH.time desc LIMIT 1) as roleName
      from room_user RU
      where RU.userId = ${userId} and RU.isJoined = true
    `);

    res.send(rawData);
  }

  // 선생님: 모든 학생이 조인한 방 리스트
  static getRoomsOfTeacher = async (req, res) => {
    const entityManager = getManager();
    const rawData = await entityManager.query(`
      select distinct(RU.questionId), RU.questionName,
          (select CH.roleName from chat_history CH where CH.questionId = RU.questionId 
            ORDER BY CH.time desc LIMIT 1) as roleName
      from room_user RU where RU.isJoined = true
    `);

    res.send(rawData);
  }
}