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

  static selectRoom = ({questionId, userId}) => {
    return getConnection().createQueryBuilder()
      .select("room_user")
      .from(RoomUser, "room_user")
      .where("questionId = :questionId and userId = :userId", {questionId, userId})
      .getOne();
  }

  static insertRoom = ({questionId, questionName, userId, isJoined}) => {
    return getConnection().createQueryBuilder()
      .insert()
      .into(RoomUser)
      .values({questionId, questionName, userId, isJoined})
      .execute();
  }

  static updateRoom = ({questionId, userId, isJoined, isRead}) => {
    return getConnection().createQueryBuilder()
      .update(RoomUser)
      .set({
        isJoined, isRead
      })
      .where("questionId = :questionId and userId = :userId", {questionId, userId})
      .execute();
  }

  static joinRoom = async ({questionId, questionName, userId, isJoined, isRead}) => {
    const room = await ChatDAO.selectRoom({questionId, userId});
    console.log('join: ', room);
    if (room) {
      await ChatDAO.updateRoom({questionId, userId, isJoined, isRead})
    } else {
      await ChatDAO.insertRoom({questionId, questionName, userId, isJoined})
    }
  }

  static getUserOfRoom = async ({questionId}) => {
    return getConnection().createQueryBuilder()
      .select("room_user")
      .from(RoomUser, "room_user")
      .where("questionId = :questionId and isJoined = 1", {questionId})
      .getMany();
  }

  static setNotRead = async ({questionId, userIds}) => {
    await getConnection().createQueryBuilder()
      .update(RoomUser)
      .set({
        isRead: false
      })
      .where("questionId = :questionId and userId IN (:userIds)", {questionId, userIds})
      .execute();
  }
}