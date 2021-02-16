import {UserDTO} from "../dto/UserDTO";

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
  users.splice(index, 1);

  return user;
};

const getUser = (id) => users[id];

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

export default { addUser, removeUser, getUser, getCurrentUsersInMatchingRoom };