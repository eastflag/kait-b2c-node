import {getConnection, getManager} from "typeorm";
import {ChatHistory} from "../entity/ChatHistory";
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
    await ChatDAO.updateRoom({questionId, userId, isJoined, isRead: null})
    return res.send(new ResultVo(0, 'success'));
  }

  // 학생: 본인이 조인한 방 리스트: 학생이 조인
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
        select CH.id, RU.questionId, RU.questionName, CH.roleName, CH.isClear, CH.time from
            (select * from chat_history
             WHERE chat_history.id in (select max(id) from chat_history GROUP BY questionId)
            ) CH left join
            (select * from room_user
             GROUP BY questionId
            ) RU on CH.questionId = RU.questionId
        ORDER BY CH.id desc
    `);

    // 학생메시지이나 선생님이 완료처리한 isClear가 true인 것은 제외한다.
    // const result = rawData.filter(item => !item.isClear);

    res.send(rawData);
  }

  // 학생의 메시지가 맨 마지막에 위치하고 있는 경우 clear를 셋팅해서 읽음처리한다.
  static setClearChatHistory = async (req, res) => {
    const {questionId} = req.query;

    const entityManager = getManager();
    const rawData = await entityManager.query(`
      select id
      from chat_history
      where questionId = ${questionId}
      order by time desc
      LIMIT 1
    `);
    console.log(rawData);

    if (rawData.length > 0) {
      const id = rawData[0].id;
      await entityManager.query(`
        update chat_history
        set isClear = 1
        where id = ${id}  
      `);
    }

    res.send(new ResultVo(0, "success"));
  }
}