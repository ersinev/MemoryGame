import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

function Players() {
  return (
    <>
      <Container fluid>
        <Row className="justify-content-center">
         
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>School</Form.Label>
                <Form.Control type="text" placeholder="SchoolName" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupRoomId">
                <Form.Label>Room Id</Form.Label>
                <Form.Control type="text" placeholder="RoomId" />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Players;
