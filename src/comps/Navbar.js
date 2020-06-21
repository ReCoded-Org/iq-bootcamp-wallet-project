import React from "react";
import { Navbar, Dropdown, ButtonGroup, Button } from "react-bootstrap";

export default function Navigation({ title, ...props }) {
  return (
    <Navbar bg="dark" variant="dark" className="mb-3">
      <Navbar.Brand href="#home" className="mr-auto">
        {title}
      </Navbar.Brand>
      <WalletButtons {...props} />
    </Navbar>
  );
}

function WalletButtons({
  wallets,
  setActiveWalletId,
  activeWalletId,
  toggleModal,
}) {
  const activeWallet = wallets[activeWalletId];
  return (
    <>
      {wallets.length && (
        <Dropdown as={ButtonGroup}>
          <Button variant="info">{activeWallet.name}</Button>
          <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />
          <Dropdown.Menu alignRight>
            {wallets.map((w, idx) => (
              <Dropdown.Item
                as={Button}
                key={w.name + idx}
                onClick={() => setActiveWalletId(idx)}
                className={w === activeWallet ? "active" : ""}
              >
                {w.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item as={Button} onClick={() => toggleModal(true)}>
              + Create new wallet
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}
