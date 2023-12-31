import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";

function PlayerInput({ onJoinGame }) {
  const [name, setName] = useState("");
  
  const [roomId, setRoomId] = useState("");

  const handleStartGame = () => {
    
    if (name.trim() === "" || roomId.trim() === "") {
      alert("Please enter your name and room ID.");
      return;
    }

    
    onJoinGame(roomId, name);
  };

  return (
    <>
      <Container fluid>
        <Row className="justify-content-center" style={{fontFamily:"Black Ops One,Ariel"}}>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Naam</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Vul je naam in"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
             
              <Form.Group className="mb-3" controlId="formGroupRoomId">
                <Form.Label>Room ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </Form.Group>
            </Form>
            <Button onClick={handleStartGame}>Start  Game</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PlayerInput;
