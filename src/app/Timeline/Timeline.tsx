import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { BsFullscreen } from 'react-icons/bs';
import Handle from './Handle';

function Timeline({ element
  , onPlay, onSeek, onPause, playingNow, muted, setMuted
}) {
  const [pointerAt, setPointerAt] = useState(0);
  const [duration, setDuration] = useState(0);
  const lineRef = useRef(null);

  // useEffect(() => {
  //   setPointerAtRolling(pointerAt);
  //   const INTERVAL = 100;
  //   if (playing) {
  //     const interval = setInterval(() => {
  //       setPointerAtRolling((pointerAt) =>{
  //        return Math.min(pointerAt + INTERVAL, duration)
  //       }
  //       );
  //     }, INTERVAL);
  //     return () => clearInterval(interval);
  //   }
  // }, [pointerAt, playing, duration]);

  useEffect(() => {
    if (!element) {
      return
    }

    console.log("⏱ Initing timeupdate listener")
    setDuration(element.duration * 1000)
    setPointerAt(element.currentTime * 1000)
    const onTimeUpdate = e => {
      setPointerAt(e.target.currentTime * 1000)
    }
    const onSeeking = e => {
      console.log("seeked")
      setPointerAt(e.target.currentTime * 1000)
    }
    element.addEventListener('timeupdate', onTimeUpdate);
    element.addEventListener('seeking', onSeeking);

    return () => {
      element.removeEventListener('timeupdate', onTimeUpdate);
      element.removeEventListener('seeking', onSeeking);

    }
  }, [element])

  if (!element) {
    return <div>
      "no element"
    </div>
  }
  return (
    <div

      className="h-full w-full flex flex-row "
    >
      {playingNow &&
        <>
          <div className="text-white flex items-center">
            <button className=" px-4 h-full" onClick={() => {
              if (playingNow.state == "playing") {
                onPause()
              } else {
                onPlay()
              }
            }}>{
                playingNow.state == "playing" ?
                  <FaPause />
                  : <FaPlay />

              }</button>
          </div>
          <div ref={lineRef} className="flex flex-grow relative items-center">


            <Handle parent={lineRef.current} duration={duration} value={pointerAt}
              onUp={(ms) => onSeek(ms)
              }
            />

          </div>
          <div className="text-white flex items-center px-2">
            <button onClick={() => setMuted(!muted)} className=" px-2 h-full">{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
          </div>
          <div className="text-white flex items-center">
            <button className=" px-2 h-full"><BsFullscreen /></button>
          </div>
        </>
      }
    </div>
  );
}

export default Timeline;
