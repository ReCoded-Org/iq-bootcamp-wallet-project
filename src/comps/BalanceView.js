import React from "react";
import { Row, Col } from "react-bootstrap";

export default function BalanceView({ wallet }) {
  return (
    <Row>
      <Col sm={12}>
        <h2>
          Current Balance:{" "}
          {wallet.currency.sign + wallet.getBalance().toFixed(2)}
        </h2>
      </Col>
    </Row>
  );
}
