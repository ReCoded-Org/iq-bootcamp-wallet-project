class Wallet {
    constructor(
        name,
        description,
        currency,
        balance = 0,
        transactions,
    ) {
        this.name = name;
        this.balance = balance;
        this.transactions = transactions ? transactions : [];
        this.description = description;
        this.currency = currency;
    }

    getBalance() {
        let balance = this.transactions.reduce((a, t) => {
            return a + t.getAmount();
        }, this.balance);
        return `${this.currency.sign} ${balance.toFixed(2)}`;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    toJSON() {
        return JSON.stringify({
            name: this.name,
            description: this.description,
            currency: this.currency.toJSON(),
            balance: this.balance,
            transactions: this.transactions.map(t => t.toJSON())
        })
    }

    static fromJSON(json) {
        json = typeof json === 'string' ? JSON.parse(json) : json
        let currency = Currency.fromJSON(json.currency)
        let transactions = json.transactions.map(t => Transaction.fromJSON(t))

        return new this(json.name, json.description, currency, json.balance, transactions)
    }
}

class Transaction {
    constructor(amount, note, tags = [], date = new Date()) {
        this.amount = amount;
        this.note = note;
        this.tags = tags;
        this.date = date;
        this.uid = Transaction.generateUID();
    }

    toHTML() {
        const li = document.createElement("li");
        li.classList.add("list-group-item")
        li.classList.add("clickable")
        li.setAttribute("data-toggle", "collapse")
        li.setAttribute("data-target", `#td-${this.uid}`)
        li.setAttribute('aria-expanded', 'false')
        li.setAttribute('aria-controls', `td-${this.uid}`)


        const amountDiv = document.createElement("div")
        amountDiv.classList.add("row")

        const amount = document.createElement("h3");
        amount.classList.add("col-md-6")
        if (this instanceof Expense) {
            amount.classList.add("expense");
        } else {
            amount.classList.add("income");
        }

        const dateP = document.createElement("p");
        dateP.classList.add("col-md-6", "text-right")
        dateP.innerText =
            this.date.toDateString() + " | " + this.date.toLocaleTimeString();

        amountDiv.append(amount, dateP)

        const detailsDiv = document.createElement("div")
        detailsDiv.classList.add("collapse")
        detailsDiv.id = `td-${this.uid}`

        const noteP = document.createElement("p");
        const tagsP = document.createElement("p");

        amount.innerText = this.amount;
        noteP.innerText = this.note;

        this.tags.map(t => {
            let span = document.createElement('span')
            span.classList.add("badge", 'badge-pill', 'badge-dark', 'mr-2')
            span.innerText = t

            return span;
        }).forEach(s => tagsP.appendChild(s))

        detailsDiv.append(noteP, tagsP);

        li.append(amountDiv, detailsDiv);
        return li;
    }

    toJSON() {
        return JSON.stringify({ ...this })
    }

    static fromJSON(json) {
        json = typeof json === 'string' ? JSON.parse(json) : json
        return new this(json.amount, json.note, new Date(json.date), json.tags)
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
        return JSON.stringify({ ...this })
    }

    static fromJSON(json) {
        json = typeof json === 'string' ? JSON.parse(json) : json
        return new this(json.name, json.sign, json.exchangeRate)
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
loadWallets()


function loadWallets() {
    if (window.localStorage) {
        const data = localStorage.getItem("wapp-wallets")
        if (data) {
            wallets = JSON.parse(data)
            activeWallet = wallets[0]
        }
    }
}

function saveWallets() {
    if (window.localStorage) {
        let json = wallets.map(w => w.toJSON())
        localStorage.setItem("wapp-wallets", JSON.stringify(json))
    }
}

toggleWalletView(!!activeWallet)

function toggleWalletView(showWallet) {
    let nwv = document.getElementById("no-wallet-view")
    let wv = document.getElementById("wallet-view")
    let walletBtns = document.getElementById("wallet-btns")
    if (!showWallet) {
        wv.classList.remove("d-block")
        wv.classList.add("d-none")

        nwv.classList.add("d-block")
        nwv.classList.remove("d-none")
        walletBtns.classList.add("d-none")
    } else {
        wv.classList.remove("d-none")
        wv.classList.add("d-block")
        nwv.classList.add("d-none")
        nwv.classList.remove("d-block")
        walletBtns.classList.remove('d-none')
    }
}


const createWalletBtn = document.getElementById("create-wallet-btn")
createWalletBtn.addEventListener('click', (e) => {
    const iName = document.getElementById("wallet-name-input")
    const iBalance = document.getElementById("wallet-balance-input")
    const iDesc = document.getElementById("wallet-desc-input")
    const iCurrencyIQD = document.getElementById("currency-iqd")
    const iCurrencyUSD = document.getElementById("currency-usd")

    const currency = iCurrencyIQD.value ? Currency.IQD() : Currency.USD()
    let w = new Wallet(iName.value, iDesc.value, currency, iBalance.value)
    wallets.push(w)
    saveWallets()

    toggleWalletView(true)
})

const transactionButton = document.getElementById('transaction-input');
transactionButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (getElementById('income-radio')) {
        let income = new Income(getElementById('transaction-input').value, "");
        activeWallet.addTransaction(income);
    } else {
        let expense = new Expense(getElementById('transaction-input').value, "");
        activeWallet.addTransaction(expense);
    }
})


/*
// Some logic
let wallet = new Wallet("Allan's Wallet", 1000);
wallet.addTransaction(
    new Expense(325.21, "Bought a Nike Sneakers", new Date(), [
        "shoes",
        "sports",
        "life",
    ])
);
wallet.addTransaction(
    new Income(35.21, "Refund", new Date(), ["Lunch", "Food"])
);
console.log(wallet.getBalance());
console.log(wallet);
const balanceDisplay = document.getElementById("balance-display");
balanceDisplay.innerHTML = "Current Balance: " + wallet.getBalance();

const transactionList = document.getElementById("transactions-list");
wallet.transactions.forEach((element) => {
    transactionList.appendChild(element.toHTML());
});

console.log(wallet.transactions[0].toJSON())*/