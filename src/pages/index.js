import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
// import firebase from "firebase/app";
import moment from "moment";
import cryptoRandomString from "crypto-random-string";
import FirebaseInit, {UserContext} from "../templates/FirebaseInit"
import { navigate } from '@reach/router';

import firebase from "firebase/app";

function Intro() {
  // let history = useHistory();
  const user = useContext(UserContext);
  // let location = useLocation();

  const newRoom = () => {
    const boardId = cryptoRandomString({ length: 6 });
    firebase
      .database()
      .ref("boards")
      .child(boardId)
      .set({
        title: "",
        files: [],
        user: user.uid,
        created: new Date().getTime(),
      })
      .then(() => {
        navigate("/" + boardId);
        firebase
          .database()
          .ref("stats/boardsCreatedTotal")
          .set(firebase.database.ServerValue.increment(1));
        firebase
          .database()
          .ref("stats/dates")
          .child(moment().format("YYYY-MM-DD"))
          .child("boardsCreated")
          .set(firebase.database.ServerValue.increment(1));
      });
  };

  return (
        <div
          className="flex flex-col bg-gradient-to-tr  from-gray-100 pt-0 to-yellow-50 min-h-screen"
        //  {...getRootProps()}
        >
          <h1 className="text-5xl  font-bold text-black text-center pt-40 pb-10">
            <div className="mb-1">FileParty lets you</div>
            <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
              play any media in sync
              </div>
          </h1>
          <div className="flex flex-col items-center justify-center">


            {/* </div>
            <div className="flex justify-center"> */}
            <Button className="bg-blue-500 text-white" onClick={() => newRoom(user)}>Create room</Button>

            <div className=" 
                font-light text-gray-600
              " onClick={() => { }}>
              or <button className="underline font-light">try a demo room</button>
            </div>
          </div>
          <video controls width="400" height="400" src={"/big_1.webm"} />
        </div>

  );
}

export default Intro;
function Button({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={"rounded mx-2 text-center font-normal w-40 mb-3 p-3 px-5 " + className}
    >
      {children}
    </button>
  );
}
