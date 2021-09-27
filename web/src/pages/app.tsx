import React, { useContext, useEffect, useState } from "react";

import Board from "../app/Board";
import { Router } from "@reach/router"
import FirebaseInit, { UserContext } from '../templates/FirebaseInit';
import Create from '../app/Create';
import SEO from "../templates/seo";
import { Helmet } from 'react-helmet';


function App() {
  const { user, loading } = useContext(UserContext)
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <SEO title="FileParty" />
      <Router basepath="/">
        {/* @ts-ignore */}
        <Create user={user} loading={loading} path="/app/create" />
        {/* @ts-ignore */}
        <Board path="/app/:boardId" />
      </Router>
    </>
  );
}

const Wrapper = () => (
  <FirebaseInit>
    <App />
  </FirebaseInit>
)
// {user ? (

//   "Loading..."
// )}
export default Wrapper;
