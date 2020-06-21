import React from "react";
import { Button } from "react-bootstrap";

export default function NoWalletView({ toggleModal }) {
  return (
    <div className="text-center m-3">
      <img
        className="mb-5"
        style={{ width: "25%" }}
        src="https://cdn.onlinewebfonts.com/svg/img_290493.png"
        alt="no wallet"
      />
      <h3>Ooops!</h3>
      <p>You have no wallets. Start by creating one</p>
      <Button variant="info" onClick={() => toggleModal(true)}>
        Create wallet
      </Button>
    </div>
  );
}
