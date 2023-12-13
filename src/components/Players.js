import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function Players({ players, currentTurn, points }) {
  let mdSize;
  if (players.length === 2) {
    mdSize = 6;
  } else if (players.length === 3) {
    mdSize = 4;
  } else if (players.length === 4) {
    mdSize = 3;
  } else {
    mdSize = 12;
  }

  
  return (
    <Container fluid className="players">
      <Row>
        {players.map((player, index) => (
          <Col
            key={index}
            md={mdSize}
            style={{
              backgroundColor:
                currentTurn === player.id ? "green" : "transparent",
              padding: "10px",
            }}
            
          >
            {`${player.name}: ${points[player.id] || 0}`}
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Players;
