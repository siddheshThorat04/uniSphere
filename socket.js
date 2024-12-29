const {
    addUser,
    removeUser,
    getUser,
    getUsers,
    addUnpairedUser,
    getUnpairedUsers,
    removeUnpairedUser
} = require("./users");

module.exports = function (server) {
    const io = require("socket.io")(server, {
        cors: {
            "Access-Control-Allow-Origin": process.env.FRONTEND_URL
        }
    });

    const activeChats = {}; // Track ongoing chats by userId

    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        // Handle new online user
        socket.on("new-online-user", (userId, callback) => {
            const { error } = addUser(userId, socket.id);
            if (error) return callback(error);

            // Reset online users list
            const onlineUsers = getUsers();
            io.emit("get-online-users", onlineUsers);
            callback();
        });

        // Handle user pairing
        socket.on("pairing-user", (userId, callback) => {
            // Check if user is already in an active chat
            if (activeChats[userId]) {
                return callback("User is already in an active chat.");
            }

            // Add the user to the unpaired queue
            const { error } = addUnpairedUser(userId);
            if (error) return callback(error);

            const unpairedUsers = getUnpairedUsers();

            // Pair only when there are at least two unpaired users
            if (unpairedUsers.length >= 2) {
                const user1 = getUser(unpairedUsers[0]);
                const user2 = getUser(unpairedUsers[1]);

                // Remove from unpaired queue
                removeUnpairedUser(user1.userId);
                removeUnpairedUser(user2.userId);

                // Add to active chats
                activeChats[user1.userId] = user2.userId;
                activeChats[user2.userId] = user1.userId;

                // Notify both users
                io.to(user1.socketId).emit("user-paired", user2.userId);
                io.to(user2.socketId).emit("user-paired", user1.userId);

                console.log(`Paired ${user1.userId} with ${user2.userId}`);
            }
        });

        // Handle unpairing
        socket.on("unpairing-user", (userId, callback) => {
            const partnerId = activeChats[userId];
            if (partnerId) {
                // Notify the partner
                const partner = getUser(partnerId);
                io.to(partner.socketId).emit("chat-close");

                // Remove both users from active chats
                delete activeChats[userId];
                delete activeChats[partnerId];

                // Re-add to the unpaired queue
                addUnpairedUser(partnerId);
            }
            callback();
        });

        // Handle message sending
        socket.on("send-message", (receiver, message, callback) => {
            const user = getUser(receiver)
            if (!user) {
                return callback()
            }
            io.to(user.socketId).emit("send-message", message)
            io.to(socket.id).emit("receive-message", message)
            callback()
        });

        // Handle chat closure
        socket.on("chat-close", (userId, callback) => {
            const partnerId = activeChats[userId];
            if (partnerId) {
                const partner = getUser(partnerId);
                io.to(partner.socketId).emit("chat-close");

                // Remove both users from active chats
                delete activeChats[userId];
                delete activeChats[partnerId];
            }
            callback();
        });
        socket.on("typing", (userId) => {
            const user = getUser(userId)
            io.to(user.socketId).emit("typing")
        })
        socket.on("typing stop", (userId) => {
            const user = getUser(userId)
            io.to(user.socketId).emit("typing stop")
        })
        socket.on("disconnect", () => {
            const user = removeUser(socket.id);
            if (user) {
                const userId = user.userId;

                // Remove from unpaired queue
                removeUnpairedUser(userId);

                // Handle active chat cleanup
                const partnerId = activeChats[userId];
                if (partnerId) {
                    const partner = getUser(partnerId);
                    io.to(partner.socketId).emit("chat-close");

                    // Remove partner from active chats
                    delete activeChats[userId];
                    delete activeChats[partnerId];

                    // Re-add partner to unpaired queue
                    addUnpairedUser(partnerId);
                }

                // Reset online users list
                const onlineUsers = getUsers();
                io.emit("get-online-users", onlineUsers);
            }

            console.log('🔥: A user disconnected');
        });
    });
};
