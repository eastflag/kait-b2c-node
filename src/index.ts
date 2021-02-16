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

// socketio 문법
io.of('/chatServer').on('connection', socket => {
  console.log('User connected');

  socket.on('join', ({ questionId, userId, userName, questionName }, cb) => {
    console.log('join');
    const { error, user } = users.addUser({ id: socket.id, questionId, userId, userName, questionName });

    if(error) {
      return cb(error);
    }

    socket.join(user.questionId);

    socket.emit('system-message', {
      user: 'system',
      msg: `Let's welcome ${user.userName} to the room ${user.questionName}. ✨✨`,
      time: new Date(),
    });

    socket.broadcast.to(user.questionId).emit('system-message', {
      user: 'system',
      msg: `${user.userName} has joined! 👏`,
      time: new Date(),
    });

    io.to(user.questionId).emit('room-detail', {
      room: user.questionId,
      users: users.getCurrentUsersInMatchingRoom(user.questionId),
    });

    cb();
  });

  socket.on('message', (message) => {
    const user = users.getUser(socket.id);

    if (user && user.questionId) {
      io.to(user.questionId).emit('system-message', {
        user: user.userName,
        msg: message,
        time: new Date(),
      });
    } else {
      console.log('An error has occurred with sending message.');
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if(user) {
      io.to(user.questionId).emit('system-message', {
        user: 'system',
        msg: `${user.userName} has left the room.`,
        time: new Date(),
      });

      io.to(user.questionId).emit('room-detail', {
        room: user.questionId,
        users: users.getCurrentUsersInMatchingRoom(user.questionId)});
    }
  })
});