import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import render from 'render-media';
import Present from "./graphics/present.inline.svg";
import Timeline from './Timeline/Timeline';

type mediaType = "no-media" | "video" | "image" | "audio" | "file" | "pdf" | "not-loaded"

let playVirginityTaken = false
function Media({ onSetPlayingNow, playingNow, torrents, files }) {
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
  const [allowPlay, setAllowPlay] = useState(false)

  const file = files[playingNow?.key]
  const torrent = torrents?.find(t => file?.magnet == t.magnetURI)

  useEffect(() => {
    // setLoaded(false);
    if (!playingNow) {
      setMediaType("no-media")
      return
    }
    console.log("⚠️ ~ playingNow", playingNow, torrents)
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
    if (!allowPlay) {
      return
    }
    if (currentFile.type == "video" || currentFile.type == "audio") {

      const element = refs[currentFile.type]?.current
      console.log("🚀 ~ element", element)
      element.currentTime = (playingNow.position / 1000)
      if (playingNow.state == "playing") {
        if (element.paused) {
          console.log("attempting to play")
          element.play()
        }
      } else if (playingNow.state == "paused") {
        if (!playVirginityTaken) {
          element.play()
          setTimeout(() => {
            element.pause()
            element.currentTime = 0
          }, 20)
          playVirginityTaken = true
        } else if (!element.paused) {
          console.log("attempting to pause")
          element.pause()
        } else if(element.paused){
          element.play()
          setTimeout(() => {
            element.pause()
            element.currentTime = 0
          }, 20)
        }
      }
    }
    // mainRef.current
    // return () => ref.off()
  }, [playingNow, currentFile, allowPlay]);

  const onPlay = () => {
    console.log("play")
    setAllowPlay(true)
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
    <div
      className="flex justify-center  rounded-r flex-grow bg-gray-200"
    >
      <div className="flex flex-col  w-full text-center align-middle justify-center">
        <div className="flex">
          <div className="select-none px-3 py-1 text-sm text-gray-800 ml-4 border-b-0 flex flex-grow-0 flex-row items-center bg-yellow-50 border border-gray-500">
            <Present className="inline w-3 h-3 mr-2" /> Presenter screen
            </div>
        </div>
        <div className="bg-gray-800 w-full" style={{
          backgroundColor: "#4B4B4B"
        }}>
          <div className="h-64 flex items-center justify-center">

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
              controls={false}
              ref={videoRef}
              className={classNames(
                (mediaType != "video" || !allowPlay) && "hidden",
                "h-full"
              )}
            />
            {((mediaType == "video" || mediaType == "audio") && !allowPlay) &&
              <div className="flex flex-col font-light text-2xs text-gray-100">

                Need to allow playback
                <button
                  className="py-3 px-5 border border-gray-100"
                  onClick={() => {
                    setAllowPlay(true)
                  }}
                >Allow playback</button>
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
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Media;
