const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 3000 });

const rooms = { General: [] };
const users = {};

server.on("connection", (socket) => {
    socket.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.type === "join") {
            users[socket] = data.username;
        } else if (data.type === "create_room") {
            if (!rooms[data.roomName]) {
                rooms[data.roomName] = [];
            }
            server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "room_list", rooms: Object.keys(rooms) }));
                }
            });
        } else if (data.type === "message") {
            const timestamp = new Date().toLocaleTimeString();
            rooms[data.room].push({ username: data.username, message: data.message, timestamp });
            server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "message", username: data.username, message: data.message, timestamp }));
                }
            });
        }
    });
});
