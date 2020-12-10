import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Peer from 'peerjs';

import Host from './Host';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import cryptoRandomString from 'crypto-random-string';

function App() {


  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Host />
        </Route>
        {/* <Route path="/receive/:target">
          <Receive />
        </Route> */}
        <Route path="*">
          <div>not found</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
