import React, { useState } from "react";
import Transaction from "../models/Transaction";

export default function TransactionForm({ wallet, addTransaction }) {
  const [transaction, setTransaction] = useState({
    note: "",
    amount: 0,
    isExpense: false,
    tags: [],
  });

  const addTransactionInternal = (e) => {
    e.preventDefault();
    const t = Transaction.fromJSON(JSON.stringify(transaction));
    addTransaction(t);
  };

  return (
    // <!-- Transaction Form -->
    <form className="form-group mt-5" onSubmit={addTransactionInternal}>
      <div className="row">
        <label htmlFor="transaction-input" className="col-4 col-form-label">
          Add a transaction:
        </label>
      </div>
      <div className="row">
        <div className="input-group col-4">
          <input
            type="number"
            className="form-control"
            placeholder="Enter an amount"
            aria-label="Amount (with dot and two decimal places)"
            value={transaction.amount.toString()}
            onChange={(e) =>
              setTransaction({ ...transaction, amount: +e.target.value })
            }
          />
          <div className="input-group-append">
            <span className="input-group-text">{wallet.currency.sign}</span>
            <span className="input-group-text">
              {(
                wallet.getBalance() +
                transaction.amount * (transaction.isExpense ? -1 : 1)
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="btn-group btn-group-toggle col-4">
          <label
            className={[
              "btn",
              "btn-outline-success",
              transaction.isExpense ? "" : "active",
            ].join(" ")}
          >
            <input
              type="radio"
              name="trans-type"
              checked={!transaction.isExpense}
              onChange={(e) =>
                setTransaction({ ...transaction, isExpense: !e.target.checked })
              }
            />
            Income
          </label>
          <label
            className={[
              "btn",
              "btn-outline-danger",
              transaction.isExpense ? "active" : "",
            ].join(" ")}
          >
            <input
              type="radio"
              name="trans-type"
              checked={transaction.isExpense}
              onChange={(e) =>
                setTransaction({ ...transaction, isExpense: e.target.checked })
              }
            />
            Expense
          </label>
        </div>
      </div>

      <div className="row">
        <label htmlFor="note-input" className="col-4 col-form-label">
          Transaction Notes:
        </label>
        <label htmlFor="tags-input" className="col-4 col-form-label">
          Transaction tags:
        </label>
      </div>
      <div className="row">
        <div className="input-group col-4">
          <input
            type="text"
            id="note-input"
            className="form-control"
            placeholder="Transaction Notes"
            aria-label="Notes about the transactions"
            value={transaction.note}
            onChange={(e) =>
              setTransaction({ ...transaction, note: e.target.value })
            }
          />
        </div>
        <div className="input-group col-4">
          <input
            type="text"
            id="tags-input"
            className="form-control"
            placeholder="Transaction tags (split tags by comma)"
            aria-label="tags"
            value={transaction.tags.join(", ")}
            onChange={(e) =>
              setTransaction({
                ...transaction,
                tags: e.target.value.split(",").map((t) => t.trim()),
              })
            }
          />
        </div>

        <input
          type="submit"
          value="Add Transaction"
          className="btn btn-secondary col-4"
        />
      </div>
    </form>
  );
}
