import React, { useState, useEffect } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import "./styles.css";
const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractForm } = newContextComponents;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isAdmin, setIsAdmin] = useState(undefined);
  const { drizzle } = useDrizzle();
  const state = useDrizzleState((state) => state);

  useEffect(() => {
    const init = async () => {
      const admin = await drizzle.contracts.ICO.methods.admin().call();
      setIsAdmin(admin.toLowerCase() === state.accounts[0].toLowerCase());
    };
    init();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <div className="container">
        <h2>Start</h2>
        <ContractForm drizzle={drizzle} contract="ICO" method="start" />
      </div>
      <div className="container">
        <h2>Whitelist</h2>
        <ContractForm drizzle={drizzle} contract="ICO" method="whitelist" />
      </div>
      <div className="container">
        <h2>Release Tokens</h2>
        <ContractForm drizzle={drizzle} contract="ICO" method="release" />
      </div>
      <div className="container">
        <h2>Withdraw</h2>
        <ContractForm drizzle={drizzle} contract="ICO" method="withdraw" />
      </div>
    </div>
  );
};
