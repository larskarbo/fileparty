import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
// import firebase from "firebase/app";
import moment from "moment";
import cryptoRandomString from "crypto-random-string";
import FirebaseInit, { UserContext } from "../templates/FirebaseInit"
import { navigate } from '@reach/router';
import { IoReloadCircle } from "react-icons/io";

import { useLocalStorage } from 'react-use';
import firebase from "firebase/app";
import Media from "../app/Media";
import { graphql } from 'gatsby';
import GatsbyImage from 'gatsby-image';
import {
  TwitterShareButton,
} from "react-share";

function Intro({ data }) {
  const user = useContext(UserContext);

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
    >
      <h1 className="text-5xl  font-bold text-black text-center pt-40 pb-10">
        <div className="mb-1">FileParty lets you</div>
        <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div>
      </h1>
      <div className="flex flex-col items-center justify-center">
        <div className="relative">

          <Button className="bg-blue-500 text-white">Create room</Button>
          <Button className="opacity-0 absolute left-0 z-20" onClick={() => newRoom(user)}>Create room</Button>
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




        <Show data={data} />
      </div>

    </div>

  );
}

const timers = []

const Show = ({ data }) => {
  const mainLars = useRef()
  const [progr, setProgr] = useState(0)
  const [videoAbove, setVideoAbove] = useState(true)
  const [active, setActive] = useState(null)
  const [buttons, setButtons] = useState(false)
  const [paused, setPaused] = useState(true)
  const [player, setPlayer] = useState(null)
  const [waitingToStart, setWaitingToStart] = useState(true)


  const events = [
    {
      timestamp: 11100,
      action: () => {
        setButtons(true)
      }
    },
    {
      timestamp: 13230,
      action: () => {
        setActive("A")
        setVideoAbove(false)
        setPlayer({
          type: "video",
          value: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
        })
      }
    }
    , {
      timestamp: 18000,
      action: () => {
        setActive("B")
        setVideoAbove(true)

        setPlayer({
          type: "video",
          value: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        })
      }
    },
    {
      timestamp: 22000,
      action: () => {
        setActive("C")
        setPlayer({
          type: "image",
          value: data.file.childImageSharp.fixed,
          zoom: false
        })
      }
    },
    {
      timestamp: 23300,
      action: () => {
        setPlayer({
          type: "image",
          value: data.file.childImageSharp.fixed,
          zoom: true
        })
      }
    },
    {
      timestamp: 26400,
      action: () => {
        setButtons(false)
        setPlayer(null)
      }
    }
  ]


  useEffect(() => {
    if (mainLars) {
      if(waitingToStart){
      } else {
        mainLars.current.currentTime = 0
        mainLars.current.play()
        // mainLars.current.currentTime = 0
      }
    }

  }, [mainLars, waitingToStart])

  useEffect(() => {
    if (mainLars && !paused) {
      const unsubs = []
      events.forEach(e => {
        const timeUntil = e.timestamp - progr
        if (timeUntil < 0) {
          e.action()
        } else if (timeUntil > 0) {
          const timeout = setTimeout(e.action, timeUntil)
          unsubs.push(() => clearTimeout(timeout))
        }
      })

      return () => unsubs.forEach(u => u())
    }

  }, [mainLars, progr, paused])

  const scale = 1.5
  return (
    <div className="relative mt-24">

      <video
        onSeeked={() => {
          setProgr(Math.round(mainLars.current.currentTime * 1000))
          console.log(Math.round(mainLars.current.currentTime * 1000))
        }}
        onPlay={() => {
          setProgr(Math.round(mainLars.current.currentTime * 1000))
          setPaused(false)
        }}
        onPause={() => {
          setPaused(true)
          // setProgr(mainLars.current.currentTime)
          console.log(Math.round(mainLars.current.currentTime * 1000))
        }}
        ref={mainLars} muted
        controls={false}
        width={200 * scale} src={"/better.webm"}
        className="absolute"
        style={{
          top: -130 * scale,
          left: -99 * scale,
          zIndex: videoAbove ? 5 : 15
        }}
      />
      <div className="rounded relative overflow-hidden shadow-2xl" style={{
        width: 300,
        height: 168,
        backgroundColor: "#323232",
        zIndex: 10
      }}>
        {(player && player.type == "video") &&
          <video
            controls={true}
            // ref={videoRef}
            autoPlay
            muted
            src={player.value}
          // className={}
          />
        }
        {(player && player.type == "image") &&
          <GatsbyImage
            className={"transform transition-transform duration-200 origin-top-right " + (player.zoom ? "scale-125" : "scale-100")}
            fixed={player.value}
            style={{
              width: "100%",
              height: "100%"
            }}
          // className={}
          />
        }
        {waitingToStart &&
        <div className="flex justify-center pt-4">
        <button
        onClick={() => {
          mainLars.current.currentTime = 0
          mainLars.current.play()
          setWaitingToStart(false)
        }}
        className="border-2 border-gray-50 hover:opacity-100 transition-opacity duration-200  text-gray-50 opacity-80 font-normal px-4 py-2 rounded">Restart</button>
        <TwitterShareButton />
        </div>
        }
        {/* <audio
          ref={audioRef}
          className={classNames(
            (mediaType != "audio") && "hidden",
            ""
          )}
        /> */}

      </div>
<div className="relative flex justify-center">
  
        <div className="h-4 w-48 bg-red-500 transform rotate-45 absolute rounded -mt-12" style={{
        backgroundColor: "#323232",
        }} />
        <div className="h-4 w-48 bg-red-500 transform -rotate-45 absolute rounded -mt-12" style={{        backgroundColor: "#323232",
        }} />
</div>
      {buttons &&
        <>
          <Bop className={(active == "A" && "bg-blue-400")}
            style={{
              top: -70
            }}
          />
          <Bop className={(active == "B" && "bg-blue-400")}
            style={{
              top: -50
            }}
          />
          <Bop className={(active == "C" && "bg-blue-400")}
            style={{
              top: -30
            }}
          />
        </>
      }
    </div>
  )
}

const Bop = ({ className, style }) => (
  <button className={"w-10 h-3 rounded-lg shadow bg-gray-600 absolute " + className}
    style={style}
  ></button>
)

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

export const query = graphql`
{
  file(relativePath: { eq: "nature.jpg" }) {
    childImageSharp{
      fixed(width: 375, height: 210) {
        ...GatsbyImageSharpFixed
      }
  
    }
  }
}

`