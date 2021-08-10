import React from "react";
import { Drizzle } from "@drizzle/store";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import drizzleOptions from "./drizzleOptions";
import LoadingContainer from "./LoadingContainer.js";
import ICOInfo from "./ICOInfo";
import Investor from "./Investor";
import Admin from "./Admin";
import Diagram from "./Assets/Diagram.png";
import Description from "./Description";
import "./styles.css";
const drizzle = new Drizzle(drizzleOptions);
const { DrizzleProvider } = drizzleReactHooks;

function App() {
  return (
    <div className="container">
      <h1>FINLESS WAREHOUSE DEFI PROTOCOL</h1>
      <DrizzleProvider drizzle={drizzle}>
        <LoadingContainer>
          <div className="Paragraph-container">
            <Description />
          </div>
          <ICOInfo />
          <Investor />
          <Admin />
          <h2>Diagram of Project</h2>
          <img src={Diagram} />
        </LoadingContainer>
      </DrizzleProvider>
    </div>
  );
}

export default App;
