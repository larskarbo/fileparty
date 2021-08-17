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
import Helmet from "react-helmet"
import SEO from "../templates/seo"

function Intro() {

  return (
    <div
      className="flex flex-col bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen"
    >

      <Helmet>
        <meta property="og:url" content="https://fileparty.co/" />
        <link rel="canonical" href="https://fileparty.co/" />
      </Helmet>

      <SEO />

      <h1 className="text-5xl font-bold text-black text-center pt-40 pb-10">
        <div className="mb-1">FileParty lets you</div>
        <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div>
      </h1>
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-3">

          <button className="rounded mx-2 text-center font-normal w-40 p-3 px-5  bg-blue-500 text-white">Create room</button>
          <Link to="/app/create" className="rounded mx-2 text-center font-normal w-40 p-3 px-5 opacity-0 absolute left-0 z-20" >Create room</Link>
        </div>
        {/* <div className="relative">
          <div className=" 
                font-light text-gray-600
              " onClick={() => { }}>
            or drop a file here
          </div>
          <div className=" 
                font-light text-gray-600 opacity-0 absolute left-0 top-0 z-20
              " onClick={() => { }}>
            or drop a file here
          </div>
        </div> */}




        <Show />

        <LarsKarbo />

        <div className="my-8 font-light flex flex-col items-center gap-4 text-gray-500 underline text-sm">
          <div>
            <Link to="/codec-checker/">Online Video Codec Checker</Link>
          </div>
          <div>
            <Link to="/watch-local-videos-with-friends-online/">5 ways to watch local videos with friends online</Link>
          </div>
          
        </div>
        <div className="py-10">
          
        </div>
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
