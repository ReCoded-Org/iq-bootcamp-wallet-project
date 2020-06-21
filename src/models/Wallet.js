import Transaction from "./Transaction";
import Currency from "./Currency";

import { immerable, produce } from "immer";

export default class Wallet {
  [immerable] = true;

  constructor(name, description, currency, balance = 0, transactions) {
    this.name = name;
    this._balance = +balance;
    this.transactions = transactions ? transactions : [];
    this.description = description;
    this.currency = currency;
  }

  getBalance() {
    let balance = this.transactions.reduce((a, t) => {
      return a + t.getAmount();
    }, this._balance);
    return balance;
  }

  addTransaction(transaction) {
    return produce(this, (draft) => {
      draft.transactions.push(transaction);
    });
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      currency: this.currency.toJSON(),
      balance: this._balance,
      transactions: this.transactions.map((t) => t.toJSON()),
    };
  }

  static fromJSON(json) {
    json = typeof json === "string" ? JSON.parse(json) : json;
    let currency = Currency.fromJSON(json.currency);
    let transactions = json.transactions.map((t) => Transaction.fromJSON(t));

    return new this(
      json.name,
      json.description,
      currency,
      json.balance,
      transactions
    );
  }
}
