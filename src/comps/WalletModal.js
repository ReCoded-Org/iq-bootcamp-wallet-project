import React, { useRef } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Wallet from "../models/Wallet";
import Currency from "../models/Currency";

export default function ({ onHide, show, onSubmit }) {
  const name = useRef(null);
  const USDCurrency = useRef(null);
  const description = useRef(null);
  const startingBalance = useRef(null);

  const createWallet = () => {
    const wallet = new Wallet(
      name.current.value,
      description.current.value,
      USDCurrency.current.checked ? Currency.USD() : Currency.IQD(),
      startingBalance.current.value
    );
    onSubmit(wallet);
  };

  return (
    <Modal show={show} onHide={onHide} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Creat new wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* <!-- Name --> */}
          <Form.Group as={Row} controlId="wallet-name">
            <Form.Label column md={3}>
              Name
            </Form.Label>
            <Col md={9}>
              <Form.Control ref={name} type="text" placeholder="Enter Name" />
            </Col>
          </Form.Group>
          {/* <!-- Currency --> */}
          <fieldset>
            <Form.Group as={Row} controlId="wallet-currency">
              <Form.Label as="legend" column md={3}>
                Currency
              </Form.Label>
              <Col md={9}>
                <Form.Check
                  type="radio"
                  label="US Dollars ($)"
                  name="currency-input"
                  ref={USDCurrency}
                  id="wallet-currency-usd"
                  defaultChecked={true}
                />
                <Form.Check
                  type="radio"
                  label="Iraqi Dinars (IQD)"
                  id="wallet-currency-iqd"
                  name="currency-input"
                />
              </Col>
            </Form.Group>
          </fieldset>
          {/* <!-- Balance --> */}
          <Form.Group as={Row} controlId="wallet-balance">
            <Form.Label column md={3}>
              Balance
            </Form.Label>
            <Col md={9}>
              <Form.Control
                type="number"
                ref={startingBalance}
                defaultValue="0"
                min="0"
                placeholder="Enter Start Balance"
              />
            </Col>
          </Form.Group>

          {/* <!-- Description --> */}
          <Form.Group as={Row} controlId="wallet-desc">
            <Form.Label column md={3}>
              Description
            </Form.Label>
            <Col md={9}>
              <Form.Control
                type="text"
                ref={description}
                placeholder="Enter Description"
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="info" onClick={createWallet}>
          Add Wallet
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
