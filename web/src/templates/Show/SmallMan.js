/* eslint-disable no-unused-expressions */

import React, { useEffect, useRef, useState } from "react";
import GatsbyImage from 'gatsby-image';

export const SmallMan = ({ bigMan, active, buttons, controls, player, paused, type = "app", className = "" }) => {
  const thisVideo = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bigMan && !paused) {
      console.log("paused", paused)
      const unsubs = [];
      events.forEach(e => {
        const timeUntil = e.timestamp - bigMan.current.currentTime * 1000;
        if (timeUntil < 0) {
          e.action();
        } else if (timeUntil > 0) {
          const timeout = setTimeout(e.action, timeUntil);
          unsubs.push(() => clearTimeout(timeout));
        }
      });

      return () => unsubs.forEach(u => u());
    }

  }, [bigMan, paused]);

  const events = [
    { timestamp: 2000, action: () => { thisVideo.current.play() } },
    { timestamp: 5500, action: () => { setVisible(true) } },
    { timestamp: 28500, action: () => { setVisible(false) } },
  ];

  useEffect(() => {
    if (bigMan) {

      const onSeeked = () => {
        thisVideo.current.currentTime = bigMan.current.currentTime;
      };
      const onPlay = () => {
        // if(bigMan.current.currentTime > 2){
        //   thisVideo.current.currentTime = bigMan.current.currentTime;

        //     thisVideo.current.play();

        // }
        // setTimeout(() => {
        // }, 2000);
        // setTimeout(() => {
        //   setVisible(true);
        // }, 2000 + 3500);


        // setTimeout(() => {
        //   setVisible(false)
        // }, 2000 + 3500)
      };
      const onPause = () => {
        // thisVideo.current.pause()
      };
      const onEnded = () => {
      };
      bigMan.current.addEventListener("pause", onPause);
      bigMan.current.addEventListener("ended", onEnded);
      bigMan.current.addEventListener("play", onPlay);
      bigMan.current.addEventListener("seeked", onSeeked);

      return () => {
        bigMan.current?.removeEventListener("pause", onPause);
        bigMan.current?.removeEventListener("ended", onEnded);
        bigMan.current?.removeEventListener("play", onPlay);
        bigMan.current?.removeEventListener("seeked", onSeeked);

      };
    }
  }, [bigMan]);
  return (
    <div className={"flex flex-row " + className}>
      <div className={"flex items-center transform transition-all duration-200 " + (visible ? "opacity-100 scale-125" : "opacity-0 scale-100")}>
        {(type == "app") &&

          <div className={"transform  mr-4 w-12 p-2  shadow rounded  " } style={{
            backgroundColor: "#CFCFCF"
          }}>
            <div className="h-4  mb-2 w-full overflow-hidden" style={{
            width:32,
            height: (168/300) * 32,
              backgroundColor: "#525252"
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

            </div>
            {["A", "B", "C"].map(letter => (
              <div key={letter} className={"flex flex-row mb-1 " + (!buttons && "invisible")}>
                <div className="flex flex-grow" style={{
                  backgroundColor: "#929292"
                }}>

                </div>
                <button className={"flex-shrink rounded w-2 ml-2 h-1 " + (active == letter ? "bg-blue-400" : "bg-gray-600")}></button>
              </div>

            ))}
          </div>
        }
        {(type == "full") &&

          <div className="h-4 w-16  rounded mb-2 overflow-hidden" style={{
            width:64,
            height: (168/300) * 64,
            backgroundColor: "#525252"
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

          </div>
        }
      </div>
      <video
        ref={thisVideo}
        style={{}}
        width={50}
        muted
        autoPlay={false}
        controls={controls}
        src={"/smallman1.webm"} />
    </div>
  );
};
