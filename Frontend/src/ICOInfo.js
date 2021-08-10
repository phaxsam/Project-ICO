import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractData } = newContextComponents;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { drizzle } = useDrizzle();
  const state = useDrizzleState((state) => state);

  return (
    <>
      <div className="ico">
        <div className="ico-child">
          <h2>Admin</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="admin"
          />
        </div>
        <div className="ico-child">
          <h2>Token</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="token"
          />
        </div>
        <div className="ico-child">
          <h2>End</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="end"
            render={(end) => {
              if (!end) return 0;
              return new Date(parseInt(end) * 1000).toLocaleString();
            }}
          />
        </div>
      </div>
      <div className="ico">
        <div className="ico-child">
          <h2>Price</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="price"
          />
        </div>
        <div className="ico-child">
          <h2>Minimum Purchase</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="minPurchase"
          />
        </div>
        <div className="ico-child">
          <h2>Maximum Purchase</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="maxPurchase"
          />
        </div>
        <div className="ico-child">
          <h2>Available Tokens</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="availableTokens"
          />
        </div>
        <div className="ico-child">
          <h2>Released</h2>
          <ContractData
            drizzle={drizzle}
            drizzleState={state}
            contract="ICO"
            method="released"
          />
        </div>
      </div>
    </>
  );
};
