import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

function AdminPanel() {
  const [onlineUsersArr, setOnlineUsersArr] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [onlineUsers, setOnlineUsers] = useState("");

  useEffect(() => {
    const adminSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      query: "room=admin",
    });

    adminSocket.on("online-users", (data) => {
      setOnlineUsersArr(data);
      setOnlineUsers(data.length - 1);
    });

    adminSocket.on("room-data", (data) => {
      setRoomData(data);
    });

    adminSocket.emit("join-room", "admin");

    return () => {
      adminSocket.disconnect();
    };
  }, []);

  return (
    <div style={{ color: "black", backgroundColor: "whitesmoke" }}>
      <h2>Admin Panel</h2>
      <h3>Online Users: {onlineUsers}</h3>
      <ul>
        {Object.keys(roomData).map((roomKey) => (
          <li key={roomKey}>
            {roomKey}: {roomData[roomKey].players.length} users in the room
          </li>
        ))}
      </ul>
      <h3>Room Data</h3>
      <pre>{JSON.stringify(roomData, null, 2)}</pre>
    </div>
  );
}

export default AdminPanel;
