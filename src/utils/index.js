import Wallet from "../models/Wallet";

export default class Utils {
  static async loadWallets(key = "wapp-wallets") {
    if (window.localStorage) {
      const storage = localStorage.getItem(key);
      if (storage) {
        return JSON.parse(storage).map((obj) => Wallet.fromJSON(obj));
      }
    }
    return [];
  }

  static saveWallets(wallets, key = "wapp-wallets") {
    if (window.localStorage) {
      let json = wallets.map((w) => w.toJSON());
      localStorage.setItem(key, JSON.stringify(json));
    }
  }
}
