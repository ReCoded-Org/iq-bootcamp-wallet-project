import React, { useContext, useEffect } from "react";
import "./App.css";
import Utils from "./utils";

import { StateContext } from "./State";
import Navbar from "./comps/Navbar";
import WalletView from "./comps/WalletView";
import NoWalletView from "./comps/NoWalletView";
import WalletModal from "./comps/WalletModal";
import { Container } from "react-bootstrap";

function App() {
  const {
    wallets,
    showWallets,
    showModal,
    setWallets,
    setActiveWallet,
    toggleShowModal,
    toggleShowWallets,
  } = useContext(StateContext);

  useEffect(() => {
    Utils.loadWallets().then((wallets) => {
      if (wallets.length) {
        setActiveWallet(wallets[0], 0);
        setWallets(wallets);
        toggleShowWallets(true);
      }
    });
  }, [setActiveWallet, setWallets, toggleShowWallets]);

  useEffect(() => {
    console.log("saving");
    Utils.saveWallets(wallets);
  }, [wallets]);

  const addWallet = (wallet) => {
    setActiveWallet(wallet, wallets.length);
    setWallets([...wallets, wallet]);
    toggleShowModal(false);
  };

  return (
    <div className="App">
      <Navbar title="Wallet App" />
      <Container>
        {showWallets && <WalletView />}
        {!showWallets && <NoWalletView />}
      </Container>
      <WalletModal
        show={showModal}
        onHide={() => toggleShowModal(false)}
        onSubmit={addWallet}
      />
    </div>
  );
}

export default App;
