import React from "react";

import Transaction from "./Transaction";
import BalanceView from "./BalanceView";
import TransactionForm from "./TransactionForm";
import { ListGroup } from "react-bootstrap";
export default function WalletView({ wallet, addTransaction }) {
  return (
    <>
      <BalanceView wallet={wallet} />
      <TransactionForm wallet={wallet} addTransaction={addTransaction} />
      <h3>Transactions</h3>
      <ListGroup variant="flush">
        {wallet.transactions.map((t) => (
          <Transaction key={t.uid} data={t} />
        ))}
      </ListGroup>
    </>
  );
}
