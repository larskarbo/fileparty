import React, { useEffect, useRef, useState } from "react";
import GatsbyImage from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';
import ShareLink from 'react-twitter-share-link'
import { FaTwitter } from "react-icons/fa";

export const BigMan = ({ mainLars, active, controls, buttons, player,
  setPaused, setProgr, paused, setPlayer, setButtons, setActive
}) => {
  const data = useStaticQuery(graphql`
  {
    natureFile:file(relativePath: { eq: "nature.jpg" }) {
      childImageSharp{
        fixed(width: 375, height: 210) {
          ...GatsbyImageSharpFixed
        }
    
      }
    }
  }
  
  `)
  const [waitingToStart, setWaitingToStart] = useState(false);
  const [videoAbove, setVideoAbove] = useState(true);
  const scale = 1.5;


  useEffect(() => {
    if (mainLars && !paused) {
      const unsubs = [];
      events.forEach(e => {
        const timeUntil = e.timestamp - mainLars.current.currentTime * 1000;
        if (timeUntil < 0) {
          e.action();
        } else if (timeUntil > 0) {
          const timeout = setTimeout(e.action, timeUntil);
          unsubs.push(() => clearTimeout(timeout));
        }
      });

      return () => unsubs.forEach(u => u());
    }

  }, [mainLars, paused]);

  const events = [
    {
      timestamp: 11100,
      action: () => {
        setButtons(true);
      }
    },
    {
      timestamp: 13230,
      action: () => {
        setActive("A");
        setVideoAbove(false);
        setPlayer({
          type: "video",
          value: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
        });
      }
    },
    {
      timestamp: 18000,
      action: () => {
        setActive("B");
        setVideoAbove(true);

        setPlayer({
          type: "video",
          value: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        });
      }
    },
    {
      timestamp: 22000,
      action: () => {
        setActive("C");
        setPlayer({
          type: "image",
          value: data.natureFile.childImageSharp.fixed,
          zoom: false
        });
      }
    },
    {
      timestamp: 23300,
      action: () => {
        setPlayer({
          type: "image",
          value: data.natureFile.childImageSharp.fixed,
          zoom: true
        });
      }
    },
    {
      timestamp: 26400,
      action: () => {
        setButtons(false);
        setPlayer(null);
      }
    }
  ];

  return (

    <div className="relative mt-24">

      <video
        onSeeked={() => {
          setProgr(Math.round(mainLars.current.currentTime * 1000));
          console.log(Math.round(mainLars.current.currentTime * 1000));
        }}
        onPlay={() => {
          setProgr(Math.round(mainLars.current.currentTime * 1000));
          setPaused(false);
        }}
        onPause={() => {
          setPaused(true);
          // setProgr(mainLars.current.currentTime)
          console.log(Math.round(mainLars.current.currentTime * 1000));
        }}
        onEnded={() => {
          setWaitingToStart(true);
        }}
        ref={mainLars} muted
        controls={controls}
        width={200 * scale} src={"/bigman.webm"}
        className="absolute"
        style={{
          top: -130 * scale,
          left: -99 * scale,
          zIndex: videoAbove ? 5 : 15
        }} />
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
            src={player.value} />}
        {(player && player.type == "image") &&
          <GatsbyImage
            className={"transform transition-transform duration-200 origin-top-right " + (player.zoom ? "scale-125" : "scale-100")}
            fixed={player.value}
            style={{
              width: "100%",
              height: "100%"
            }} />}
        {waitingToStart &&
          <div className="flex flex-col h-full justify-center items-center">
            <button
              onClick={() => {
                mainLars.current.currentTime = 0;
                mainLars.current.play();
                setWaitingToStart(false);
              }}
              className="border-2 mb-4 border-gray-50 hover:opacity-100 transition-opacity duration-200  text-gray-50 opacity-80 font-normal px-4 py-2 rounded">Restart</button>
            <ShareLink link='https://fileparty.co'>
              {link => (
                <a href={link} className="
                border-2 border-blue-400 hover:opacity-100 transition-opacity duration-200  text-blue-400 opacity-80 font-normal px-4 py-2 rounded
                flex flex-row items-center
                " target='_blank'><FaTwitter className="mr-1" /> Share</a>
              )}
            </ShareLink>
          </div>}


      </div>
      <div className="relative flex justify-center">

        <div className="h-4 w-48 bg-red-500 transform rotate-45 absolute rounded -mt-12" style={{
          backgroundColor: "#323232",
        }} />
        <div className="h-4 w-48 bg-red-500 transform -rotate-45 absolute rounded -mt-12" style={{
          backgroundColor: "#323232",
        }} />
      </div>
      {buttons &&
        <>
          <Bop className={(active == "A" && "bg-blue-400")}
            style={{
              top: -70
            }} />
          <Bop className={(active == "B" && "bg-blue-400")}
            style={{
              top: -50
            }} />
          <Bop className={(active == "C" && "bg-blue-400")}
            style={{
              top: -30
            }} />
        </>}


    </div>
  );
};


const Bop = ({ className, style }) => (
  <button className={"w-10 h-3 rounded-lg shadow bg-gray-600 absolute " + className}
    style={style}
  ></button>
);
