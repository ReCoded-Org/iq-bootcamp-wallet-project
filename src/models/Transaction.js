export default class Transaction {
  constructor(amount, note, tags = [], date = new Date()) {
    this.amount = +amount;
    this.note = note;
    this.tags = tags;
    this.date = date;
    this.uid = Transaction.generateUID();
  }
  isExpense() {
    return this instanceof Expense;
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
    return { ...this, isExpense: this.isExpense() };
  }

  static fromJSON(json) {
    json = typeof json === "string" ? JSON.parse(json) : json;
    const isExpense = json.isExpense;
    if (isExpense) {
      return new Expense(
        json.amount,
        json.note,
        json.tags,
        json.date ? new Date(json.date) : new Date()
      );
    } else {
      return new Income(
        json.amount,
        json.note,
        json.tags,
        json.date ? new Date(json.date) : new Date()
      );
    }
  }

  static generateUID() {
    return Math.random().toString(36).substring(7);
  }
}

export class Expense extends Transaction {
  getAmount() {
    return this.amount * -1;
  }
}

export class Income extends Transaction {
  getAmount() {
    return this.amount;
  }
}
