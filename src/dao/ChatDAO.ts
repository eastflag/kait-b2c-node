import {getConnection} from "typeorm";
import {ChatHistory} from "../entity/ChatHistory";
import {RoomUser} from "../entity/RoomUser";

export class ChatDAO {
  static insertChat = async ({questionId, userId, userName, roleName, msg, time}) => {
    await getConnection().createQueryBuilder()
      .insert()
      .into(ChatHistory)
      .values({questionId, userId, userName, roleName, msg, time})
      .execute();
  }

  static selectRoom = ({userId}) => {
    return getConnection().createQueryBuilder()
      .select("room_user")
      .from(RoomUser, "room_user")
      .where("userId = :userId", {userId})
      .getOne();
  }

  static insertRoom = ({questionId, questionName, userId, isJoined, chatHistoryId}) => {
    return getConnection().createQueryBuilder()
      .insert()
      .into(RoomUser)
      .values({questionId, questionName, userId, isJoined, chatHistoryId})
      .execute();
  }

  static updateRoom = ({questionId, isJoined, chatHistoryId}) => {
    return getConnection().createQueryBuilder()
      .update(RoomUser)
      .set({
        isJoined, chatHistoryId
      })
      .where("questionId = :questionId", {questionId})
      .execute();
  }

  static joinRoom = async ({questionId, questionName, userId, isJoined, chatHistoryId}) => {
    const room = await ChatDAO.selectRoom({userId});
    if (room) {
      await ChatDAO.updateRoom({questionId, isJoined, chatHistoryId})
    } else {
      await ChatDAO.insertRoom({questionId, questionName, userId, isJoined, chatHistoryId})
    }
  }

  static leaveRoom = async ({questionId, isJoined, chatHistoryId}) => {
    await ChatDAO.updateRoom({questionId, isJoined, chatHistoryId})
  }
}