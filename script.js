document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const chatPage = document.getElementById("chat-page");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const roomList = document.getElementById("rooms");
    const newRoomForm = document.getElementById("new-room-form");
    const newRoomName = document.getElementById("new-room-name");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const messages = document.getElementById("messages");

    let username = "";
    let room = "General";
    const socket = new WebSocket("ws://localhost:3000");

    // Login Form
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        username = usernameInput.value;
        loginPage.style.display = "none";
        chatPage.style.display = "flex";

        socket.send(JSON.stringify({ type: "join", username }));
    });

    // New Room Creation
    newRoomForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const roomName = newRoomName.value;
        socket.send(JSON.stringify({ type: "create_room", roomName }));
        newRoomName.value = "";
    });

    // Message Sending
    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = messageInput.value;
        socket.send(JSON.stringify({ type: "message", room, username, message }));
        messageInput.value = "";
    });

    // Handle WebSocket Messages
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${data.username} (${data.timestamp}): ${data.message}`;
            messages.appendChild(messageElement);
        } else if (data.type === "room_list") {
            roomList.innerHTML = "";
            data.rooms.forEach((roomName) => {
                const roomElement = document.createElement("li");
                roomElement.textContent = roomName;
                roomList.appendChild(roomElement);
                roomElement.addEventListener("click", () => {
                    room = roomName;
                    socket.send(JSON.stringify({ type: "join_room", room }));
                });
            });
        }
    };
});
