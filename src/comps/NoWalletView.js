import React, { useContext } from "react";
import { StateContext } from "../State";
import { Button } from "react-bootstrap";

export default function NoWalletView(props) {
  const state = useContext(StateContext);
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
      <Button variant="info" onClick={() => state.toggleShowModal(true)}>
        Create wallet
      </Button>
    </div>
  );
}
