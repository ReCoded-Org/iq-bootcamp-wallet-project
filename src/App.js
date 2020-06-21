import React, { useState, useEffect } from "react";
import "./App.css";
import Utils from "./utils";

import Navbar from "./comps/Navbar";
import WalletView from "./comps/WalletView";
import NoWalletView from "./comps/NoWalletView";
import WalletModal from "./comps/WalletModal";
import { Container } from "react-bootstrap";

function App() {
  const [state, setState] = useState({
    wallets: [],
    activeWalletId: -1,
    showModal: false,
  });

  useEffect(() => {
    Utils.loadWallets().then((wallets) => {
      if (wallets.length) {
        setState({ ...state, wallets, activeWalletId: 0 });
      }
    });
  }, []);

  useEffect(() => {
    console.log("saving wallets");
    Utils.saveWallets(state.wallets);
  }, [state.wallets]);

  const addWallet = (wallet) => {
    setState({
      wallets: [...state.wallets, wallet],
      activeWalletId: state.wallets.length,
      showModal: false,
    });
  };

  const addTransaction = (transaction) => {
    const newWallets = [...state.wallets];
    const draft = state.wallets[state.activeWalletId].addTransaction(
      transaction
    );
    newWallets[state.activeWalletId] = draft;
    setState({ ...state, wallets: newWallets });
  };

  const toggleModal = (toggle) => {
    setState({ ...state, showModal: toggle });
  };

  return (
    <div className="App">
      <Navbar
        title="Wallet App"
        wallets={state.wallets}
        setActiveWalletId={(idx) => setState({ ...state, activeWalletId: idx })}
        activeWalletId={state.activeWalletId}
        toggleModal={toggleModal}
      />
      <Container>
        {state.activeWalletId >= 0 && (
          <WalletView
            wallet={state.wallets[state.activeWalletId]}
            addTransaction={addTransaction}
          />
        )}
        {state.activeWalletId < 0 && <NoWalletView toggleModal={toggleModal} />}
      </Container>
      <WalletModal
        show={state.showModal}
        onHide={() => toggleModal(false)}
        onSubmit={addWallet}
      />
    </div>
  );
}

export default App;
