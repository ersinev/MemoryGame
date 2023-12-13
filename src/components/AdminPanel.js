import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

function AdminPanel() {
  const [roomData, setRoomData] = useState({});
  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

  useEffect(() => {
    const adminSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      query: "room=admin",
    });

    adminSocket.on("online-users", (data) => {
      setTotalOnlineUsers(data.total);
    });

    adminSocket.on("room-data", (data) => {
      setRoomData((prevData) => ({ ...prevData, ...data }));
    });

    adminSocket.emit("join-room", "admin");

    return () => {
      adminSocket.disconnect();
    };
  }, []); 

  return (
    <div style={{ color: "black", backgroundColor: "whitesmoke" }}>
      <h2>Admin Panel</h2>
      <p>Total Online Users: {totalOnlineUsers}</p>
      {Object.keys(roomData).map((roomId) => (
        <div key={roomId}>
          <p>
            Room ID: {roomId}, Total Users: {roomData[roomId].players.length}
          </p>
          <ul>
            {roomData[roomId].players.map((player) => (
              <li key={player.id}>
                {player.name} (ID: {player.id})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
