import cryptoRandomString from "crypto-random-string";
import firebase from "firebase/app";
import { navigate } from "gatsby";
import moment from "moment";
import React, { useEffect } from "react";
import Layout from "./Layout";

function Create({ loading, user }) {
  useEffect(() => {
    if (user) {
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
          navigate("/app/" + boardId);
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
    }
  }, [user]);

  return (
    <Layout>
      <div className="flex flex-col flex-grow items-center">
        <div
          className={
            "flex flex-col flex-grow-0 p-12 max-w-md  w-full rounded bg-white  border border-gray-300 shadow-lg "
          }
        >
          {user ? "Creating..." : "Loading..."}
        </div>
      </div>
    </Layout>
  );
}

export default Create;
