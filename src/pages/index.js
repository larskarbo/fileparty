import React, { useCallback, useContext } from "react";
// import firebase from "firebase/app";
import moment from "moment";
import cryptoRandomString from "crypto-random-string";
import FirebaseInit, { UserContext } from "../templates/FirebaseInit"
import { navigate, } from '@reach/router';
import { IoReloadCircle } from "react-icons/io";

import { useLocalStorage } from 'react-use';
import firebase from "firebase/app";
import Media from "../app/Media";
import { graphql, Link } from 'gatsby';
import { LarsKarbo } from "../templates/LarsKarbo";
import { Show } from "../templates/Show/Show";

function Intro() {
  const { user } = useContext(UserContext);



  return (
    <div
      className="flex flex-col bg-gradient-to-tr  from-gray-100 pt-0 to-yellow-50 min-h-screen"
    >
      <h1 className="text-5xl  font-bold text-black text-center pt-40 pb-10">
        <div className="mb-1">FileParty lets you</div>
        <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div>
      </h1>
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-3">

          <button className="rounded mx-2 text-center font-normal w-40 p-3 px-5  bg-blue-500 text-white">Create room</button>
          <Link to="/create" className="rounded mx-2 text-center font-normal w-40 p-3 px-5 opacity-0 absolute left-0 z-20" >Create room</Link>
        </div>
        <div className="relative">
          <div className=" 
                font-light text-gray-600
              " onClick={() => { }}>
            or <button className="underline font-light">try a demo room</button>
          </div>
          <div className=" 
                font-light text-gray-600 opacity-0 absolute left-0 top-0 z-20
              " onClick={() => { }}>
            or <button className="underline font-light">try a demo room</button>
          </div>
        </div>




        <Show />

        <LarsKarbo />

      </div>

    </div>

  );
}

const timers = []

export default Intro;

// export const query = graphql`
// {
// file(relativePath: { eq: "nature.jpg" }) {
// childImageSharp{
//   fixed(width: 144, height: 144) {
//     ...GatsbyImageSharpFixed
//   }

// }
// }
// }
// `
