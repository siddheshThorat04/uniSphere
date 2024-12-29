let onlineUsers = [];
let unpairedUsers = [];

/**
 * Adds a user to the online users list.
 * Ensures no duplicate userId or socketId exists.
 */
const addUser = (userId, socketId) => {
    const existingUser = onlineUsers.find(user => user.userId === userId);
    const existingSocket = onlineUsers.find(user => user.socketId === socketId);

    if (existingUser) {
        return { error: "UserId is already in use." };
    }
    if (existingSocket) {
        removeUser(socketId);
    }

    const user = { userId, socketId };
    onlineUsers.push(user);

    return { user };
};

/**
 * Adds a user to the unpaired users list.
 * Ensures no duplicate entries.
 */
const addUnpairedUser = (userId) => {
    const existingUser = unpairedUsers.includes(userId);

    if (existingUser) {
        return { error: "User is already in the unpaired list." };
    }

    unpairedUsers.push(userId);
    return {};
};

/**
 * Removes a user from the online users list by their socketId.
 */
const removeUser = (socketId) => {
    const userToRemove = onlineUsers.find(user => user.socketId === socketId);
    if (!userToRemove) return null;

    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
    return userToRemove;
};

/**
 * Removes a user from the unpaired users list by their userId.
 */
const removeUnpairedUser = (userId) => {
    unpairedUsers = unpairedUsers.filter(user => user !== userId);
};

/**
 * Gets a user object by their userId from the online users list.
 */
const getUser = (userId) => onlineUsers.find(user => user.userId === userId);

/**
 * Returns all online users.
 */
const getUsers = () => onlineUsers;

/**
 * Returns all unpaired users.
 */
const getUnpairedUsers = () => unpairedUsers;

module.exports = {
    getUser,
    removeUser,
    addUser,
    getUsers,
    addUnpairedUser,
    getUnpairedUsers,
    removeUnpairedUser
};
