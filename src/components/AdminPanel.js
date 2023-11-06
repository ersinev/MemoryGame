import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
function AdminPanel() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomData, setRoomData] = useState({});

  useEffect(() => {
    const adminSocket = io("http://localhost:5000", { transports: ["websocket"], query: "room=admin" });
  
    adminSocket.on("online-users", (data) => {
      setOnlineUsers(data);
      console.log(data)
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
    <div style={{color:"white"}}>
      <h2>Admin Panel</h2>
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
      <h3>Room Data</h3>
      <pre>{JSON.stringify(roomData, null, 2)}</pre>
    </div>
  );
}

export default AdminPanel;