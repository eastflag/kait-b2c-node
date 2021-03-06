import express from 'express';
import router from './router';
import bodyParser from 'body-parser';
import {createConnection} from "typeorm";
import cors from 'cors';
import http from 'http';
import users from './model/users';

const socketIO = require('socket.io');

import {User} from "./entity/User";
import {Question} from "./entity/Question";
import {ChatDAO} from "./dao/ChatDAO";


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  // cors: {
  //   origin: "http://localhost:3000",
  //   methods: ["GET", "POST", "PUT", "DELETE"]
  // }
});

createConnection(/*...*/).then(async connection => {

  // test data -------------------------------------------------------------------------------------------------------
/*  console.log("Inserting a new hero into the database...");
  let user1 = new User();
  user1.email = "ldk@gmail.com";
  user1.name = "ldk";
  await connection.manager.save(user1);
  let user2 = new User();
  user2.email = "park@gmail.com";
  user2.name = "park";
  await connection.manager.save(user2);
  const room = new Question();
  room.id = helper.getUuid();
  room.host_email = "host@gmail.com";
  room.host_name = "hostuser";
  room.name = "room1";
  room.desc = "rest room1";
  room.startdate = 1603907103;
  room.hour = 60;
  room.secrete = "public";
  room.video_host= true;
  room.video_guest= true;
  room.option_host = true;
  room.option_mic = true;
  room.option_record = true;
  room.users = [user1, user2];
  await connection.manager.save(room);
  const result = await connection.getRepository(Question).find({relations: ["users"]});
  console.log("Loaded findHero: ", result);
  console.log("Here you can setup and run express/koa/any other framework.");*/

  // start express server --------------------------------
  app.use(bodyParser.json());

  app.use(cors());

  // app.use(express.static(__dirname + '/public'));

  app.use('/api', router);

  server.listen(8080, () => {
    console.log('server is listening 8080');
  });

}).catch(error => console.log(error));

// socketio
const chatServer = io.of('/chatServer');

chatServer.on('connection', socket => {
  console.log('User connected');

  socket.on('login', ({userId, roleName}, cb) => {
    const {error, user} = users.addAllUser({id: socket.id, userId, roleName});
    if (error) {
      return cb(error);
    }
  });

  socket.on('join', ({ questionId, userId, userName, questionName, roleName }, cb) => {
    console.log('join');
    const { error, user } = users.addUser({ id: socket.id, questionId, userId, userName, questionName, roleName });

    if(error) {
      return cb(error);
    }

    socket.join(user.questionId);

    // 학생이 조인시 DB 저장
    if (user.roleName === 'user') {
      ChatDAO.joinRoom({ questionId, userId, questionName, isJoined: true, isRead: true })
    }

    // 조인시 보내는 웰컴 메시지
/*    socket.emit('message', {
      userId: null,
      userName: 'system',
      roleName: 'teacher',
      msg: `${user.questionName} 에 입장하였습니다. 궁금한 부분을 질문하시면 선생님들이 해결해드려요. ✨✨`,
      time: new Date(),
    });*/

    // 입장, 퇴장 정보는 보내지 않는다.
/*    socket.broadcast.to(user.questionId).emit('message', {
      user: 'system',
      msg: `${user.userName} has joined! 👏`,
      time: new Date(),
    });*/

    // 방에 조인한 유저 정보들
/*    chatServer.to(user.questionId).emit('room-detail', {
      room: user.questionId,
      users: users.getCurrentUsersInMatchingRoom(user.questionId),
    });*/

    cb();
  });

  socket.on('leave', ({ questionId }) => {
    users.removeUser(socket.id);
    socket.leave(questionId)
  });

  socket.on('message', async (data) => {
    // data = {type: 'text or image', msg: 'content or image id'}
    console.log('message received: ', data);
    const user = users.getUser(socket.id);
    console.log(user);

    if (!user || !user.questionId) {
      console.log('An error has occurred with sending message.');
      return;
    }

    // 채팅 히스토리 저장
    const chat = {
      userId: user.userId,
      userName: user.userName,
      roleName: user.roleName,
      type: data.type,
      msg: data.msg,
      time: new Date(),
    }
    chatServer.to(user.questionId).emit('message', chat);
    ChatDAO.insertChat({...chat, questionId: user.questionId});

    // 선생님일 경우: DB에서 현재방 join 참여자를 구하고,
    // DB join - 현재방 참여자 => 읾음 처리를 읽지 않음으로 처리 (isRead = 0)
    // (AllUsers) - (현재방 참여자) => 노티 전송
    if (user.roleName === 'teacher') {
      const dbRoomStudents = await ChatDAO.getUserOfRoom({questionId: user.questionId})
      const dbRoomStudentIds = dbRoomStudents.map(item => item.userId); // number array

      const roomUserIds = users.getUserIdsOfRoom(user.questionId); // userDTO array

      const notReadStudentIds = dbRoomStudentIds.filter(userId => roomUserIds.indexOf(userId) < 0)
      ChatDAO.setNotRead({questionId: user.questionId, userIds: notReadStudentIds});

      const allUserIds = users.getAllUserIds();
      const notiUserIds = allUserIds.filter(userId => roomUserIds.indexOf(userId) < 0);

      const notiUsers = users.getUsersByIds(notiUserIds);

      notiUsers.forEach(user => {
        chatServer.to(user.id).emit('alarm_by_teacher');
      })
    }

    // user 일 경우 현재 접속중인 모든 선생님에게 알람 전송
    if (user.roleName === 'user') {
      const allTeacherIds = users.getAllTeacherIds();
      const roomTeacherIds = users.getTeacherIdsOfRoom(user.questionId);
      const notiTeacherIds = allTeacherIds.filter(id => roomTeacherIds.indexOf(id) < 0);

      const notiUsers = users.getUsersByIds(notiTeacherIds);

      // console.log(allTeacherIds);
      // console.log(roomTeacherIds);
      // console.log(notiUsers);

      notiUsers.forEach(user => {
        chatServer.to(user.id).emit('alarm_by_user');
      })
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if(user) {
      // 퇴장 정보를 보내지 않는다.
/*      chatServer.to(user.questionId).emit('message', {
        userName: 'system',
        msg: `${user.userName} has left the room.`,
        time: new Date(),
      });*/

      // 방에 조인한 유저 정보들
/*      chatServer.to(user.questionId).emit('room-detail', {
        room: user.questionId,
        users: users.getCurrentUsersInMatchingRoom(user.questionId)});*/
    }
  })
});