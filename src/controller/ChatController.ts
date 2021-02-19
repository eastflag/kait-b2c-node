import {getConnection} from "typeorm";
import {ChatHistory} from "../entity/ChatHistory";
import {RoomUser} from "../entity/RoomUser";
import {ChatDAO} from "../dao/ChatDAO";
import {ResultVo} from "../dto/ResultVo";

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

    const db = getConnection().getRepository(RoomUser)
      .createQueryBuilder('room_user')
      .where('userId = :userId and isJoined = true', {userId})

    const chatHistories = await db.getMany();
    return res.send(chatHistories);
  }

  // 선생님: 모든 학생이 조인한 방 리스트
  static getRoomsOfTeacher = async (req, res) => {
    const {userId} = req.query;

    const db = getConnection().getRepository(RoomUser)
      .createQueryBuilder('room_user')
      .where('isJoined = true', {userId})
      .groupBy('questionId')

    const chatHistories = await db.getMany();
    return res.send(chatHistories);
  }
}