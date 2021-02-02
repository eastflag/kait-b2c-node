import express from 'express';
import router from './router';
import bodyParser from 'body-parser';
import {createConnection} from "typeorm";
import cors from 'cors';
import http from 'http';
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
  socket.on('message', (item) => {
    // const msg = item.name + ' : ' + item.message;
    console.log(item);
    // io.emit('message', {name:item.name, message:item.message});
  });

  socket.on('disconnect', () => {
    console.log('User disconnect');
  });
});