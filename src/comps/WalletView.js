import React, { useContext } from "react";
import { StateContext } from "../State";

import Transaction from "./Transaction";
import BalanceView from "./BalanceView";
import TransactionForm from "./TransactionForm";
import { ListGroup } from "react-bootstrap";
export default function WalletView(props) {
  const { activeWallet, addTransaction } = useContext(StateContext);
  return (
    <>
      <BalanceView wallet={activeWallet} />
      <TransactionForm wallet={activeWallet} addTransaction={addTransaction} />
      <h3>Transactions</h3>
      <ListGroup variant="flush">
        {activeWallet.transactions.map((t) => (
          <Transaction key={t.uid} data={t} />
        ))}
      </ListGroup>
    </>
  );
}
