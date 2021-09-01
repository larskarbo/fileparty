import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { BsFullscreen } from "react-icons/bs";
import render from "render-media";
import Timeline from "./Timeline/Timeline";

type mediaType =
  | "no-media"
  | "video"
  | "image"
  | "audio"
  | "file"
  | "not-loaded";
function Media({ onSetPlayingNow, adding, playingNow, torrent, file, done }) {
  const imageRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const contRef = useRef();
  // const pdfRef = useRef();
  const refs = {
    image: imageRef,
    audio: audioRef,
    video: videoRef,
    // pdf: pdfRef
  };
  const [mediaType, setMediaType] = useState<mediaType>("no-media");
  const [element, setElement] = useState(null);
  const [tapMe, setTapMe] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!file) {
      setMediaType("no-media");
      return;
    }

    if (!torrent) {
      setMediaType("not-loaded");
      return;
    }

    if (file.name.includes(".mp4")) {
    } else if (!done) {
      return;
    }

    setMediaType(file.type);

    console.log("file.type: ", file.type);
    if (file.type == "file") {
      console.log("TODO render file");
    } else {
      if (file.size > 200000000 && !file.name.includes(".mp4")) {
        return setMediaType("file");
      }
      const element = refs[file.type].current;
      render.render(
        torrent.files[0],
        refs[file.type].current,
        {
          controls: false,
          autoplay: false,
        },
        function (err, elem) {
          if (err) return console.error(err.message);
          setElement(element);
          console.log(elem); // this is the newly created element with the media in it
        }
      );
    }

    // mainRef.current
    // return () => ref.off()
  }, [file, torrent, done]);

  useEffect(() => {
    // setLoaded(false);
    if (!playingNow) {
      return;
    }
    if (!file) {
      return;
    }
    if (file.type == "video" || file.type == "audio") {
      const element = refs[file.type]?.current;
      element.currentTime = playingNow.position / 1000;
      if (playingNow.state == "playing") {
        if (element.paused) {
          console.log("attempting to play");
          element.play().catch((playError) => {
            if (playError?.message.includes("denied.permission")) {
              setTapMe(true);
            }
          });
        }
      } else if (playingNow.state == "paused") {
        if (!element.paused) {
          console.log("attempting to pause");
          element.pause();
        } else if (element.paused) {
        }
      }
    }
  }, [playingNow, file]);

  const onPlay = () => {
    console.log("play");
    onSetPlayingNow({
      state: "playing",
    });
  };

  const onPause = () => {
    console.log("pause");
    onSetPlayingNow({
      state: "paused",
      ...(element?.currentTime && { position: element.currentTime * 1000 }),
    });
  };

  const requestFullScreen = () => {
    const vid = contRef.current;
    if (vid.requestFullscreen) {
      vid.requestFullscreen();
    } else if (vid.mozRequestFullScreen) {
      vid.mozRequestFullScreen();
    } else if (vid.webkitRequestFullscreen) {
      vid.webkitRequestFullscreen();
    }
  };

  const onSeek = (ms) => {
    console.log("seek");
    onSetPlayingNow({
      position: ms,
    });
  };

  return (
    <div className="flex flex-col justify-between w-full " ref={contRef}>
      <div
        className="flex items-center justify-center relative w-full h-full heightMan "
        style={
          {
            // height: 500
          }
        }
      >
        <div
          className={classNames(
            mediaType != "not-loaded" && "hidden",
            "font-light text-xs text-gray-600 text-center"
          )}
        >
          <div className="font-bold">Load needed.</div>
          <div>Load the file {file?.name} to show this file</div>
        </div>

        <div
          className={classNames(
            mediaType != "no-media" && "hidden",
            "font-light text-xs text-gray-600"
          )}
        >
          <div className="flex justify-center"></div>
          <div>Waiting for host to add files...</div>
        </div>
        <div
          className={classNames(
            mediaType != "file" && "hidden",
            "font-light text-xs text-gray-600 text-center"
          )}
        >
          <div className="flex justify-center"></div>
          <p className="font-bold">
            This file can't be previewed, but you can download it.
          </p>
          <p className="mt-2">
            Tip: Video files with .mp4 extension can be streamed, even with file
            sizes more than 200mb
          </p>
        </div>

        <img
          ref={imageRef}
          className={classNames(
            mediaType != "image" && "hidden",
            " max-h-full max-w-full w-auto"
          )}
        />
        <video
          controls={true}
          ref={videoRef}
          playsInline
          preload={"auto"}
          muted={muted}
          className={classNames(mediaType != "video" && "hidden", "h-full")}
        />
        {tapMe && (
          <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
            <button
              className="border-2 border-gray-800 hover:opacity-100 transition-opacity duration-200  text-gray-800 opacity-80 font-normal px-4 py-2 rounded "
              onClick={() => {
                element.play();
                setTapMe(false);
              }}
            >
              Tap to allow playback 📣
            </button>
          </div>
        )}
        {adding && (
          <div className="absolute bg-gray-200 text-xs top-0 bottom-0 right-0 left-0 flex items-center justify-center">
            Adding {adding}...
          </div>
        )}
        <audio
          ref={audioRef}
          className={classNames(mediaType != "audio" && "hidden", "")}
        />
      </div>

      <div className="h-8 bg-gray-800 border-t border-gray-500">
        <div className="h-full w-full flex flex-row ">
          {(mediaType == "video" || mediaType == "audio") && (
            <Timeline
              element={element}
              onPlay={onPlay}
              requestFullScreen={requestFullScreen}
              onPause={onPause}
              onSeek={onSeek}
              playingNow={playingNow}
              muted={muted}
              setMuted={setMuted}
            />
          )}

          <div className="text-white flex items-center">
            <button
              onClick={() => requestFullScreen()}
              className=" px-2 h-full"
            >
              <BsFullscreen />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Media;
