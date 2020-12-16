import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { request } from './utils/request';
import firebase from 'firebase/app';
import moment from 'moment';
import cryptoRandomString from 'crypto-random-string';

function Intro({user}) {
  let history = useHistory();
  let location = useLocation();

  return (
    <div className="flex margin-auto self-center w-80 bg-white flex-col p-4 border border-gray-500 rounded max-w-md shadow"
    //  {...getRootProps()}
    >
      <button
        onClick={() => {
          const boardId = cryptoRandomString({ length: 6 })
          firebase.database().ref('boards').child(boardId).set({
            title: "",
            files: [],
            user: user.uid,
            created: new Date().getTime()
          }).then(() => {
            history.replace({ pathname: "/" + boardId });
            firebase.database().ref('stats/boardsCreatedTotal').set(firebase.database.ServerValue.increment(1))
            firebase.database().ref('stats/dates')
              .child(moment().format("YYYY-MM-DD"))
              .child("boardsCreated")
              .set(firebase.database.ServerValue.increment(1))
          });
        }}
        className="rounded text-center bg-blue-100 font-bold mb-5 border border-gray-200 shadow-sm p-3">Host room</button>
      <button className="rounded text-center bg-white font-bold mb-5 border border-gray-200 shadow-sm p-3">Join existing room</button>
      <Link to="/example" className="rounded text-center bg-white font-bold mb-5 border border-gray-200 shadow-sm p-3">Join example room</Link>

    </div>
  );
}

export default Intro;
