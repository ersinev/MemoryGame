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
      setRoomData((prevData) => ({ ...prevData, ...data }));
    });

    adminSocket.emit("join-room", "admin");

    return () => {
      adminSocket.disconnect();
    };
  }, []); 

  return (
    <div className="container" style={{ minWidth:"100%", minHeight:"100vh", display:"flex",color: "black", backgroundColor: "white",float:"left", alignItems:"center",textAlign:"center" }}>
      <div>
      <h2>Admin Panel</h2>
      <hr/>
      <h4>Total Online Users: {totalOnlineUsers}</h4>
      <Row>
        <Col>
        {Object.keys(roomData).map((roomId) => (
        <div key={roomId}>
          <h5 style={{fontWeight:"bolder"}}>
            Room ID: {roomId}, Total Users: {roomData[roomId].players.length}
          </h5>
          <ul>
            {roomData[roomId].players.map((player) => (
              <li key={player.id}>
                {player.name} (ID: {player.id})
              </li>
            ))}
          </ul>
        </div>
      ))}
        </Col>
      </Row>
     
      </div>
    </div>
  );
}

export default AdminPanel;