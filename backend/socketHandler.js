const socketIo = require('socket.io');

let io;
const userSockets = new Map(); // Store user ID to socket ID mapping

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Store user socket mapping when they join
        socket.on('join', (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} joined with socket ${socket.id}`);
        });

        // Handle ban user event
        socket.on('ban_user', (data) => {
            console.log('Ban user event received:', data);
            const targetSocketId = userSockets.get(data.userId);
            if (targetSocketId) {
                console.log(`Sending ban notification to user ${data.userId} with socket ${targetSocketId}`);
                io.to(targetSocketId).emit('user_banned', { userId: data.userId });
            } else {
                console.log(`No socket found for user ${data.userId}`);
            }
        });

        // Handle unban user event
        socket.on('unban_user', (data) => {
            console.log('Unban user event received:', data);
            const targetSocketId = userSockets.get(data.userId);
            if (targetSocketId) {
                console.log(`Sending unban notification to user ${data.userId} with socket ${targetSocketId}`);
                io.to(targetSocketId).emit('user_unbanned', { userId: data.userId });
            } else {
                console.log(`No socket found for user ${data.userId}`);
            }
        });

        // Handle role change to customer event
        socket.on('role_changed_to_customer', (data) => {
            console.log('Role changed to customer event received:', data);
            const targetSocketId = userSockets.get(data.userId);
            if (targetSocketId) {
                console.log(`Sending role change notification to user ${data.userId} with socket ${targetSocketId}`);
                io.to(targetSocketId).emit('role_changed_to_customer', { userId: data.userId });
            } else {
                console.log(`No socket found for user ${data.userId}`);
            }
        });

        socket.on('disconnect', () => {
            // Remove user from mapping when they disconnect
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`User ${userId} disconnected and removed from mapping`);
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIO };
