export default class Currency {
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
