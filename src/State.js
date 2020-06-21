import React, { useReducer, useCallback, useEffect } from "react";
import Utils from "./utils";

export const StateContext = React.createContext({});

function reducer(state, action) {
  switch (action.type) {
    case actions.TOGGLE_MODAL:
      return { ...state, showModal: action.data };
    case actions.SET_ACTIVE_WALLET:
      return {
        ...state,
        activeWalletIndex: action.index,
        activeWallet: action.wallet,
      };
    case actions.SET_WALLETS:
      return { ...state, wallets: action.wallets };
    case actions.TOGGLE_WALLET_VIEW:
      return { ...state, showWallets: action.data };
    case actions.ADD_TRANSACTION:
      const draft = state.activeWallet.addTransaction(action.transaction);
      const newWallets = [...state.wallets];
      newWallets[state.activeWalletIndex] = draft;
      console.log(newWallets, state.wallets);
      return {
        ...state,
        wallets: newWallets,
        activeWallet: draft,
      };

    default:
      return state;
  }
}

const initState = {
  wallets: [],
  activeWallet: null,
  activeWalletIndex: -1,
  showWallets: false,
  showModal: false,
};

const actions = {
  TOGGLE_MODAL: "toggle_modal",
  SET_WALLETS: "set_wallets",
  SET_ACTIVE_WALLET: "set_active_wallet",
  ADD_TRANSACTION: "add_transaction",
  TOGGLE_WALLET_VIEW: "toggle_wallet_view",
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);
  const value = {
    activeWallet: state.activeWallet,
    activeWalletIndex: state.activeWalletIndex,
    wallets: state.wallets,
    showModal: state.showModal,
    showWallets: state.showWallets,
    // methods
    setWallets: useCallback((wallets) => {
      dispatch({ type: actions.SET_WALLETS, wallets });
    }, []),
    toggleShowModal: useCallback(
      (data) => dispatch({ type: actions.TOGGLE_MODAL, data }),
      []
    ),
    toggleShowWallets: useCallback(
      (data) => dispatch({ type: actions.TOGGLE_WALLET_VIEW, data }),
      []
    ),
    setActiveWallet: useCallback(
      (wallet, index) =>
        dispatch({ type: actions.SET_ACTIVE_WALLET, wallet, index }),
      []
    ),
    addTransaction: useCallback((transaction) => {
      dispatch({ type: actions.ADD_TRANSACTION, transaction });
    }, []),
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}
