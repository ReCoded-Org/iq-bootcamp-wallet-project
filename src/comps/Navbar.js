import React, { useContext } from "react";
import { StateContext } from "../State";
import { Navbar, Dropdown, ButtonGroup, Button } from "react-bootstrap";

export default function Navigation({ title }) {
  return (
    <Navbar bg="dark" variant="dark" className="mb-3">
      <Navbar.Brand href="#home" className="mr-auto">
        {title}
      </Navbar.Brand>
      <WalletButtons />
    </Navbar>
  );
}

function WalletButtons(props) {
  const {
    activeWallet,
    setActiveWallet,
    wallets,
    toggleShowModal,
  } = useContext(StateContext);
  return (
    <>
      {wallets.length && (
        <Dropdown as={ButtonGroup}>
          <Button variant="info">{activeWallet.name}</Button>
          <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />
          <Dropdown.Menu alignRight>
            {wallets
              .filter((w) => w !== activeWallet)
              .map((w, idx) => (
                <Dropdown.Item
                  as={Button}
                  key={w.name + idx}
                  onClick={() => setActiveWallet(w, idx)}
                >
                  {w.name}
                </Dropdown.Item>
              ))}
            <Dropdown.Divider />
            <Dropdown.Item as={Button} onClick={() => toggleShowModal(true)}>
              + Create new wallet
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}
