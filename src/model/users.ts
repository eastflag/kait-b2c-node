import {UserDTO} from "../dto/UserDTO";

// 로그인한 모든 사용자 정보 저장
const allUsers = []; // [{id: socketId, userId, roleName}]
// 방에 조인한 socketId 별 사용자 상세 정보 저장, 소켓별 방은 한개만 가능
// 다른 사이트에서 접속시 소켓이 다르므로 두개가 생성이 가능하다.
// 즉, 동일한 userId 가 두개의 소켓아이디와 두개의 방이 가능하다.
const users: Array<UserDTO> = []; // {socketId: {socketId, questionId, userId}, ,,,}

// users
const addUser = (user: UserDTO) => {
  const existingUser = getUserDetailsById(user.id);

  if(!(user.id && user.questionId && user.userId && user.roleName)) {
    return { error: 'questionId or userId or rolename cannot be empty.' };
  }

  if (existingUser) {
    return { error: 'User already exists. Please return to home and try a new one.'};
  }

  users.push(user);
  console.log(users);

  return { user };
};

const removeUser = (id) => {
  const user = users.find(item => item.id === id);
  const index = users.findIndex(item => item.id === id);
  if (index > -1) {
    users.splice(index, 1);
  }

  return user;
};

const getUser = (id) =>{
  const user = users.find(item => item.id === id);
  return user;
};

// All users
const addAllUser = (user) => {
  const {id, userId, roleName} = user;
  if (!userId || !roleName) {
    return {error: 'userId or roleName is null'}
  }
  const existUser = allUsers.find(item => item.userId == userId);
  if (existUser) {
    return {error: 'userId exists'}
  }
  allUsers.push(user);
  console.log(allUsers);
  return {user}
}

const removeAllUser = (id) => {
  const index = allUsers.findIndex(item => item.id === id);
  if (index > -1) {
    allUsers.splice(index, 1);
  }
}

const getAllUsers = () => allUsers;
const getAllUserIds = () => allUsers.map(user => user.userId);

// functions
const getUsersOfRoom = (questionId) => {
  return users.filter(user => user.questionId == questionId);
};

const getUserIdsOfRoom = (questionId) => {
  return users.filter(user => user.questionId == questionId)
    .map(item => item.userId);
};

const getUserDetailsById = (id: string) => {
  if (users.length) {
    let user = users.find((user) => user.id == id);
    return user;
  }
  return false;
};

const getUsersByIds = ids => {
  return allUsers.filter(user => ids.indexOf(user.userId) >= 0);
}

export default { addUser, removeUser, getUser, getUsersOfRoom, getUserIdsOfRoom,
  addAllUser, removeAllUser, getAllUsers, getAllUserIds, getUsersByIds };