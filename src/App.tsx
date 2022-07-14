import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "./header/Header";

function App() {
  return (
    <>
      <Header />
      <div className={styles.App}>
        <p className={styles.bodyText}>Almost before we knew it, we had left the ground.</p>
      </div>
    </>
  );
}

export default App;
