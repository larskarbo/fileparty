import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "../app/index.css";

import Board from "../app/Board";
// import Admin from "../app/Admin";
import { Router, Link } from "@reach/router"
import Layout from "../app/Layout";
// import Intro from "../gatsby/src/pages";


function App() {
  

  return (
    <Layout>
      <Router basepath="/">
        {/* <Admin user={user} path="/admin" /> */}
        {/* <div user={user} path="/:boardId">Hey</div> */}
        <Board path="/:boardId" />
      </Router>
    </Layout>
  );
}

let Home = (hey) => {
console.log("🚀 ~ hey", hey)
  
  return (
  <div>
    <h1>Home</h1>
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="dashboard">Dashboard</Link>
    </nav>
  </div>
)}

// {user ? (

//   "Loading..."
// )}
export default App;
