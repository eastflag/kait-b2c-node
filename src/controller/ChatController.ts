import {getConnection} from "typeorm";
import {ChatHistory} from "../entity/ChatHistory";

export class ChatController {
  static getChatHistory = async (req, res) => {
    const {questionId} = req.query;

    const db = getConnection().getRepository(ChatHistory)
      .createQueryBuilder('chat_history')
      .where('chat_history.questionId = :questionId', {questionId})

    const chatHistories = await db.getMany();
    return res.send(chatHistories);
  }

  static getRoomOfUser = async (req, res) => {
    const {questionId} = req.query;

    const db = getConnection().getRepository(ChatHistory)
      .createQueryBuilder('room_user')
      .where('chat_history.questionId = :questionId', {questionId})

    const chatHistories = await db.getMany();
    return res.send(chatHistories);
  }
}