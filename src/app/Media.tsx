import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import render from 'render-media';
import Present from "./graphics/present.inline.svg";
import Timeline from './Timeline/Timeline';
import canAutoPlay from 'can-autoplay';
import captureFrame from "capture-frame"
type mediaType = "no-media" | "video" | "image" | "audio" | "file" | "pdf" | "not-loaded"
function Media({ onSetPlayingNow, playingNow, torrents, files, setCanAutoPlay }) {
  const imageRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const pdfRef = useRef();
  const refs = {
    image: imageRef,
    audio: audioRef,
    video: videoRef,
    pdf: pdfRef
  }
  const [mediaType, setMediaType] = useState<mediaType>("no-media")
  const [element, setElement] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)
  const [tapMe, setTapMe] = useState(false)
  const [muted, setMuted] = useState(false)

  const file = files[playingNow?.key]
  const torrent = torrents?.find(t => file?.magnet == t.magnetURI)

  useEffect(() => {

  }, [])

  useEffect(() => {
    // setLoaded(false);
    if (!playingNow) {
      setMediaType("no-media")
      return
    }
    // torrents.files[0].appendTo(imageRef.current)

    if (!file) {
      setMediaType("no-media")
      setCurrentFile(null)
      return
    }

    setCurrentFile(file)


    if (!torrent || torrent.progress != 1) {
      setMediaType("not-loaded")
      return
    }

    setMediaType(file.type)

    const element = refs[file.type].current

    console.log("🚀 ~ torrent", torrent)
    render.render(torrent.files[0], refs[file.type].current, {
      controls: false,
      autoplay: false,
    }, function (err, elem) {
      if (err) return console.error(err.message)
      setElement(element)
      console.log(elem) // this is the newly created element with the media in it
    })

    // mainRef.current
    // return () => ref.off()
  }, [playingNow?.key, files, torrent]);

  useEffect(() => {
    // setLoaded(false);
    if (!playingNow) {
      return
    }
    if (!currentFile) {
      return
    }
    if (currentFile.type == "video" || currentFile.type == "audio") {

      const element = refs[currentFile.type]?.current
      element.currentTime = (playingNow.position / 1000)
      if (playingNow.state == "playing") {
        if (element.paused) {
          console.log("attempting to play")
          element.play()
            .catch(playError => {
              console.log("🚀 ~ playError", playError)
              // alert("can't play")
              if("permission thing"){
                setTapMe(true)
              }
            })
        }
      } else if (playingNow.state == "paused") {
        // if (!playVirginityTaken) {
        //   element.play()
        //   setTimeout(() => {
        //     element.pause()
        //     element.currentTime = 0
        //   }, 20)
        //   playVirginityTaken = true
        // } else 
        // element.currentTime = 0.1

        // show the captured video frame in the DOM
        if (!element.paused) {
          console.log("attempting to pause")
          element.pause()
        } else if (element.paused) {
          // element.play()
          // setTimeout(() => {
          //   element.pause()
          //   element.currentTime = 0
          // }, 20)
        }
      }
    }
    // mainRef.current
    // return () => ref.off()
  }, [playingNow, currentFile]);

  const onPlay = () => {
    console.log("play")
    onSetPlayingNow({
      state: "playing"
    })
  }

  const onPause = () => {
    console.log("pause")
    onSetPlayingNow({
      state: "paused",
      ...(element?.currentTime && { position: element.currentTime * 1000 })
    })
  }

  const onSeeked = () => {

  }

  const onSeek = (ms) => {
    console.log("seek")
    onSetPlayingNow({
      position: ms
    })
  }

  return (
    <div>
      <div className="h-64 flex items-center justify-center relative">

        <div className={classNames(
          (mediaType != "not-loaded") && "hidden",
          "font-light text-2xs text-gray-100"
        )}>
          <div className="font-bold">
            Load needed.
              </div>
          <div>
            Load the file {currentFile?.name} to show this file
              </div>
        </div>

        <div className={classNames(
          (mediaType != "no-media") && "hidden",
          "font-light text-2xs text-gray-100"
        )}>
          <div className="flex justify-center">
            {/* <SendToPresenter
                  fill={"white"}
                  stroke={"white"}
                  className={classNames(
                    "w-5 h-5 ",
                  )}
                /> */}
          </div>
          <div>
            The presenter screen is currently empty
              </div>
        </div>
        <img
          ref={imageRef}
          className={classNames(
            (mediaType != "image") && "hidden",
            "h-full"
          )} />
        <video
          controls={true}
          ref={videoRef}
          playsInline
          preload={"auto"}
          muted={muted}
          className={classNames(
            (mediaType != "video") && "hidden",
            "h-full"
          )}
        />
        {tapMe &&
          <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
            <button className="border-2 border-gray-50 hover:opacity-100 transition-opacity duration-200  text-gray-50 opacity-80 font-normal px-4 py-2 rounded " onClick={() => {
              element.play()
              setTapMe(false)
            }}
            >Tap to allow playback 📣</button>
          </div>
        }
        <audio
          ref={audioRef}
          className={classNames(
            (mediaType != "audio") && "hidden",
            ""
          )}
        />
        <iframe
          ref={pdfRef}
          className={classNames(
            (mediaType != "pdf") && "hidden",
            ""
          )}
        />
      </div>
      <div className="h-8 bg-gray-800 border-t border-gray-500">
        {(mediaType == "video" || mediaType != "audio") &&
          <Timeline element={element}
            onPlay={onPlay}
            onPause={onPause}
            onSeek={onSeek}
            playingNow={playingNow}
            muted={muted}
            setMuted={setMuted}
          />
        }
      </div>
    </div>
  );
}

export default Media;
