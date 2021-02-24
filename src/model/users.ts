import {UserDTO} from "../dto/UserDTO";

const allUsers = [];
const users: Array<UserDTO> = []; // {socketId: {socketId, questionId, userId}, ,,,}

const getUserDetailsByUserId = (userId: string) => {
  if (users.length) {
    let userResult = users.filter((user) => user.userId === userId);
    return userResult[0];
  }
  return false;
};

const addUser = (user: UserDTO) => {
  const existingUser = getUserDetailsByUserId(user.userId);

  if(!user.userId) {
    return { error: 'Username cannot be empty. Please return to home and try again.' };
  }

  if (!user.questionId) {
    return { error: 'Room cannot be empty. Please return to home and try again.' };
  }

  if (existingUser && existingUser.userId) {
    return { error: 'User already exists. Please return to home and try a new one.'};
  }

  users.push(user);
  console.log(users);

  return { user };
};

const removeUser = (id) => {
  const user = users.find(item => item.id === id);
  const index = users.findIndex(user => user.id === id);
  if (index > -1) {
    users.splice(index, 1);
  }

  return user;
};

const getUser = (id) =>{
  const user = users.find(item => item.id === id);
  return user;
};

const getCurrentUsersInMatchingRoom = (questionId) => {
  let matchingUsers = [];
  if (users.length) {
    users.forEach((user) => {
      if (user.questionId === questionId) {
        matchingUsers.push(user);
      }
    });
  }

  return matchingUsers;
};

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

export default { addUser, removeUser, getUser, getCurrentUsersInMatchingRoom,
  addAllUser, removeAllUser };