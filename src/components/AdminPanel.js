import React, { useState, useEffect } from "react";

function AdminPanel({ socket }) {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    // Send a request to the server to get admin-specific information.
    socket.emit("admin-info-request", (data) => {
      setAdminInfo(data);
    });
  }, [socket]);

  const startGamesForAllRooms = () => {
    // Trigger the "start-games-admin" socket event to start games for all rooms.
    socket.emit("start-games-admin");
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {adminInfo ? (
        <div>
          <div>Online Users: {adminInfo.onlineUsers}</div>
          <div>Existing Room IDs: {adminInfo.roomIds.join(", ")}</div>
          <div>Users in the Rooms:</div>
          <ul>
            {Object.entries(adminInfo.roomsInfo).map(([roomId, users]) => (
              <li key={roomId}>{`Room ${roomId}: ${users} users`}</li>
            ))}
          </ul>
          <button onClick={startGamesForAllRooms}>
            Start Games for All Rooms
          </button>
        </div>
      ) : (
        <div>Loading admin information...</div>
      )}
    </div>
  );
}

export default AdminPanel;
