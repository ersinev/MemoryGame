import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
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
      setTotalOnlineUsers(data.length);
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
    <div className="container" style={{ minWidth: "100%", minHeight: "100vh", display: "flex", color: "white", backgroundColor: "#131540", float: "left", alignItems: "center", textAlign: "center" }}>
      <h2 style={{ color: "white", marginBottom: "20px", fontSize:"50px" }}>Admin Panel</h2>
      
      <h4 style={{ color: "white", marginBottom: "30px" }}>Total Online Users: {totalOnlineUsers}</h4>

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {Object.keys(roomData).map((roomId) => {
          if (roomId !== "admin") {
            return (
              <Col key={roomId} className="mb-3">
                <div style={{ backgroundColor: "#22b8cf", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                  <h5 style={{ fontWeight: "bolder", marginBottom: "15px" }}>
                    Room: {roomId}
                  </h5>
                  <h5 style={{ marginBottom: "10px" }}>
                    Users: {roomData[roomId].players.length}
                  </h5>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {roomData[roomId].players.map((player) => (
                      <li key={player.id} style={{ marginBottom: "5px" }}>
                        {player.name} 
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            );
          }
          return null;
        })}
      </Row>
    </div>
  );
}

export default AdminPanel;
