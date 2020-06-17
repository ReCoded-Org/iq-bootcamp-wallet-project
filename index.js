class Wallet {
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
    this.transactions.push(transaction);
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

class Transaction {
  constructor(amount, note, tags = [], date = new Date()) {
    this.amount = +amount;
    this.note = note;
    this.tags = tags;
    this.date = date;
    this.uid = Transaction.generateUID();
  }

  toHTML() {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.classList.add("clickable");
    li.setAttribute("data-toggle", "collapse");
    li.setAttribute("data-target", `#td-${this.uid}`);
    li.setAttribute("aria-expanded", "false");
    li.setAttribute("aria-controls", `td-${this.uid}`);

    const amountDiv = document.createElement("div");
    amountDiv.classList.add("row");

    const amount = document.createElement("h3");
    amount.classList.add("col-md-6");
    if (this instanceof Expense) {
      amount.classList.add("expense");
    } else {
      amount.classList.add("income");
    }

    const dateP = document.createElement("p");
    dateP.classList.add("col-md-6", "text-right");

    dateP.innerText =
      this.date.toDateString() + " | " + this.date.toLocaleTimeString();

    amountDiv.append(amount, dateP);

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("collapse");
    detailsDiv.id = `td-${this.uid}`;

    const noteP = document.createElement("p");
    const tagsP = document.createElement("p");

    amount.innerText = this.amount;
    noteP.innerText = this.note;

    this.tags
      .map((t) => {
        let span = document.createElement("span");
        span.classList.add("badge", "badge-pill", "badge-dark", "mr-2");
        span.innerText = t;

        return span;
      })
      .forEach((s) => tagsP.appendChild(s));

    detailsDiv.append(noteP, tagsP);

    li.append(amountDiv, detailsDiv);
    return li;
  }

  toJSON() {
    return { ...this, isExpense: this instanceof Expense };
  }

  static fromJSON(json) {
    json = typeof json === "string" ? JSON.parse(json) : json;
    const isExpense = json.isExpense;
    if (isExpense) {
      return new Expense(
        json.amount,
        json.note,
        json.tags,
        new Date(json.date)
      );
    } else {
      return new Income(json.amount, json.note, json.tags, new Date(json.date));
    }
  }

  static generateUID() {
    return Math.random().toString(36).substring(7);
  }
}
class Expense extends Transaction {
  getAmount() {
    return this.amount * -1;
  }
}
class Income extends Transaction {
  getAmount() {
    return this.amount;
  }
}
class Currency {
  constructor(name, sign, exchangeRate) {
    this.name = name;
    this.sign = sign;
    this.exchangeRate = exchangeRate;
  }
  shortName() {
    return this.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  toJSON() {
    return { ...this };
  }

  static fromJSON(json) {
    json = typeof json === "string" ? JSON.parse(json) : json;
    return new this(json.name, json.sign, json.exchangeRate);
  }

  static USD() {
    return new this("United States Dollar", "$", 1);
  }
  static IQD() {
    return new this("Iraqi Dinars", "IQD", 1200);
  }
}

let wallets = [];
let activeWallet = null;

loadWallets();

function loadWallets() {
  if (window.localStorage) {
    const data = localStorage.getItem("wapp-wallets");
    if (data) {
      wallets = JSON.parse(data).map((obj) => Wallet.fromJSON(obj));
      setWalletsDropdown(wallets);
      setActiveWallet(0);
    }
  }
}

function saveWallets() {
  if (window.localStorage) {
    let json = wallets.map((w) => w.toJSON());
    localStorage.setItem("wapp-wallets", JSON.stringify(json));
    setWalletsDropdown();
  }
}

function setWalletsDropdown() {
  const walletList = document.getElementById("wallet-list");
  walletList.innerHTML = `                
  <div class="dropdown-divider"></div>
  <button class="dropdown-item" data-toggle="modal" data-target="#wallet-form-modal">+ Create new
                    wallet</button>
  `;
  wallets.forEach((wallet, i) => {
    walletList.insertAdjacentHTML(
      "afterbegin",
      `
    <button onclick="setActiveWallet(${i})" class="dropdown-item">${wallet.name}</button>    
    `
    );
  });
}

function setActiveWallet(index) {
  activeWallet = wallets[index];

  if (activeWallet) {
    const selectedWalletButton = document.getElementById("selected-wallet-btn");
    selectedWalletButton.innerText = activeWallet.name;

    const currencySpan = document.getElementById("currency-span");
    currencySpan.innerText = activeWallet.currency.sign;

    updateBalance();
    displayTransactions();
    toggleWalletView(true);
  }
}

function displayTransactions() {
  const transList = document.getElementById("transactions-list");
  transList.innerHTML = "";
  activeWallet.transactions.forEach((t) => {
    transList.appendChild(t.toHTML());
  });
}

function updateBalance() {
  const balanceDisplay = document.getElementById("balance-display");
  balanceDisplay.innerText =
    "Wallet Balance: " +
    activeWallet.currency.sign +
    activeWallet.getBalance().toFixed(2);

  const balanceSpan = document.getElementById("balance-span");
  balanceSpan.innerText = activeWallet.getBalance().toFixed(2);
}

function toggleWalletView(showWallet) {
  let nwv = document.getElementById("no-wallet-view");
  let wv = document.getElementById("wallet-view");
  let walletBtns = document.getElementById("wallet-btns");
  if (!showWallet) {
    wv.classList.remove("d-block");
    wv.classList.add("d-none");

    nwv.classList.add("d-block");
    nwv.classList.remove("d-none");
    walletBtns.classList.add("d-none");
  } else {
    wv.classList.remove("d-none");
    wv.classList.add("d-block");
    nwv.classList.add("d-none");
    nwv.classList.remove("d-block");
    walletBtns.classList.remove("d-none");
  }
}

// Create Wallet
const createWalletBtn = document.getElementById("create-wallet-btn");
createWalletBtn.addEventListener("click", (e) => {
  const iName = document.getElementById("wallet-name-input");
  const iBalance = document.getElementById("wallet-balance-input");
  const iDesc = document.getElementById("wallet-desc-input");
  const iCurrencyIQD = document.getElementById("currency-iqd");

  const currency = iCurrencyIQD.checked ? Currency.IQD() : Currency.USD();
  let w = new Wallet(iName.value, iDesc.value, currency, iBalance.value);
  wallets.push(w);
  saveWallets();
  setActiveWallet(wallets.length - 1);
});

// Show Balance
const transInput = document.getElementById("transaction-input");
transInput.addEventListener("change", (e) => {
  let value = +e.target.value;
  const balanceSpan = document.getElementById("balance-span");
  const incomeBtn = document.getElementById("income-radio");
  balanceSpan.innerText = incomeBtn.checked
    ? (activeWallet.getBalance() + value).toFixed(2)
    : (activeWallet.getBalance() - value).toFixed(2);
});

// Create Transaction
const transForm = document.getElementById("transaction-form");
transForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const incomeBtn = document.getElementById("income-radio");
  const transInput = document.getElementById("transaction-input");
  const noteInput = document.getElementById("note-input");
  const tagsInput = document.getElementById("tags-input");
  if (incomeBtn.checked) {
    let income = new Income(
      +transInput.value,
      noteInput.value,
      tagsInput.value.split(",").map((e) => e.trim())
    );
    activeWallet.addTransaction(income);
  } else {
    let expense = new Expense(
      +transInput.value,
      noteInput.value,
      tagsInput.value.split(",").map((e) => e.trim())
    );
    activeWallet.addTransaction(expense);
  }

  displayTransactions();
  updateBalance();
  saveWallets();
});
