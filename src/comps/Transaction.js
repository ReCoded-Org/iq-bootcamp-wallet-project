import React from "react";
import { ListGroup, Row, Col, Badge } from "react-bootstrap";

export default function Transaction({ data }) {
  const className = data.isExpense() ? "expense" : "income";
  return (
    <ListGroup.Item>
      <Row>
        <Col md={6} className={className}>
          <h3>{data.amount}</h3>
        </Col>
        <Col md={6} className="text-right">
          <p>
            {data.date.toDateString()} | {data.date.toLocaleTimeString()}
          </p>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <p>{data.note}</p>
        </Col>
        <Col sm={12}>
          {data.tags.map((t, idx) => (
            <Badge key={idx} pill variant="dark" className="mr-2">
              {t}
            </Badge>
          ))}
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
