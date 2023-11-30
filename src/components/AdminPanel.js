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
      setTotalOnlineUsers((prevCount) => {
        let updatedCount = prevCount;

        if (data.added && data.added !== "admin") {
          updatedCount += 1;
        }

        if (data.removed && data.removed !== "admin") {
          updatedCount -= 1;
        }

        return updatedCount;
      });
    });

  setInterval(()=>{
    adminSocket.on("room-data", (data) => {
      setRoomData(data);
    });
  },1000)

    adminSocket.emit("join-room", "admin");

    // return () => {
    //   adminSocket.disconnect();
    // };
  }, []);

  return (
    <div style={{ color: "black", backgroundColor: "whitesmoke" }}>
      <h2>Admin Panel</h2>
      {console.log(roomData)}
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
