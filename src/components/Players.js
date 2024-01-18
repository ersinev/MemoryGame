import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function Players({ players, currentTurn, points }) {
  // Check if players is an array before mapping over it
  if (!Array.isArray(players)) {
    return null; // or handle the case appropriately
  }

  return (
    <Container fluid className="players">
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        {players.map((player, index) => (
          <Col
            key={index}
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
