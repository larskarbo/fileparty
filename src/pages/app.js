import React, { useContext, useEffect, useState } from "react";
// import logo from "./logo.svg";
import "../app/index.css";

import Board from "../app/Board";
// import Admin from "../app/Admin";
import { Router, Redirect } from "@reach/router"
import { Link } from "gatsby"
import Layout from "../app/Layout";
// import Intro from "../gatsby/src/pages";
import Login from '../app/Login';
import { UserContext } from '../templates/FirebaseInit';
import Create from '../app/Create';
import Logout from '../app/Logout';


function App() {
  const { user, loading } = useContext(UserContext)
  return (
    <Router basepath="/">
      {/* <Admin user={user} path="/admin" /> */}
      {/* <div user={user} path="/:boardId">Hey</div> */}
      <Create user={user} loading={loading} path="/create" />

      <Login user={user} path="/login" />
      <Logout path="/logout" />
      {/* <Login path="/login" /> */}
      <Board path="/:boardId" />
    </Router>
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
  )
}

// {user ? (

//   "Loading..."
// )}
export default App;
