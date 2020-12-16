import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCircle,
  FaDownload,
  FaSpinner,
  FaUpload,
} from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { AiFillWarning, AiOutlineReload } from "react-icons/ai";
import WebTorrent from "webtorrent";
import prettyBytes from "pretty-bytes";
import audio from "./graphics/audio-file.svg";
import video from "./graphics/video-file.svg";
import image from "./graphics/image-file.svg";
import file from "./graphics/file-file.svg";
import sendToPresenter from "./graphics/send-to-presenter.svg";
import { ReactComponent as SendToPresenter } from "./graphics/send-to-presenter.svg";
import presenter from "./graphics/present.svg";
import classNames from "classnames";

const icons = {
  audio,
  video,
  image,
  file,
};

function TorrentBoat({
  mainRef,
  itemKey,
  onSetTorrent,
  playingNow,
  file,
  onDelete,
  client,
  onPlay,
  torrent,
  isHost,
  user,
}) {
  const myRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [warningStale, setWarningStale] = useState(false);
  const [startedDownloading, setStartedDownloading] = useState(
    torrent?.progress == 1 || file.size < 1_000
  );

  // useEffect(() => {
  //   if (playingNow?.key == itemKey && torrent) {
  //     mainRef.current.innerHTML = "";
  //     torrent.files[0].appendTo(mainRef.current);
  //   }
  // }, [playingNow, torrent]);

  useEffect(() => {
    if (!startedDownloading) {
      return;
    }
    if (torrent) {
      console.log("torrent already exists");
      return;
    }
    console.log("adding");
    client.add(file.magnet, function (torrent) {
      console.log("added");
      onSetTorrent(torrent);
    });
  }, [startedDownloading]);

  useEffect(() => {
    if (startedDownloading && progress == 0) {
      const timeout = setTimeout(() => {
        setWarningStale(true)
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [startedDownloading, progress]);

  useEffect(() => {
    if (!torrent) {
      return;
    }
    const interval = setInterval(() => {
      setProgress(torrent.progress);
    }, 1000);
    return () => clearInterval(interval);
  }, [torrent]);

  const presentDisabled = false;

  return (
    <div
      className={classNames("mt-4", warningStale && "border border-yellow-600 bg-yellow-50 py-2")}
      style={{
        marginLeft: -20,
        marginRight: -20,
        paddingRight: 10,
      }}
    >
      <div className="flex flex-row">
        
        <div className="w-6 flex items-center justify-center">
          <button className="border border-transparent hover:border-gray-400 rounded-lg p-1 m-auto">
            <HiDotsVertical className="text-gray-500" />
          </button>
        </div>
        <div className="w-12 flex justify-center">
          <img src={icons[file.type]} />
        </div>
        <div className="flex flex-grow pr-2 flex-col w-20 pl-2 pt-1 justify-center">
          <div className="">
            <div
              onClick={() => {
                if (file.magnet) {
                  prompt("Magnet", file.magnet);
                }
              }}
              className={
                "text-xs overflow-x-hidden whitespace-nowrap text-gray-600"
              }
            >
              {file.name}
            </div>
          </div>
          <div>
            <span className="p-1 px-2 rounded-xl uppercase font-bold bg-gray-100 text-2xs text-gray-400">
              {file.type}
            </span>
          </div>
        </div>
        <div className=" flex  flex-row text-center justify-end items-center">
          {progress < 1 &&
            <>
              {startedDownloading ? (
                <Button
                  // className="mr-10"
                  progress={progress}
                >
                  {/* <img className="w-5 h-5 mr-1 max-w-none" src={sendToPresenter} /> */}
                  <div className="flex flex-row items-center whitespace-nowrap text-2xs font-bold text-gray-700">
                    LOADING ({prettyBytes(file.size)}){" "}
                    <FaCircle className="ml-1 animate-pulse" />
                  </div>
                </Button>
              ) : (
                  <Button
                    onClick={() => {
                      setStartedDownloading(true);
                    }}
                  // className="mr-10"
                  >
                    {/* <img className="w-5 h-5 mr-1 max-w-none" src={sendToPresenter} /> */}
                    <div className="flex flex-row items-center whitespace-nowrap text-2xs font-bold text-gray-700">
                      LOAD ({prettyBytes(file.size)}) <FaArrowDown className="ml-1" />
                    </div>
                  </Button>
                )}
            </>
          }
          {progress == 1 &&
            <Button
              onClick={() => {
                if (isHost) {
                  onPlay();
                } else {
                  alert("Only the host can set playback");
                }
              }}
              disabled={presentDisabled}
              className="ml-2"
            >
              <SendToPresenter
                className={classNames(
                  "w-5 h-5 mr-1 max-w-none ",
                  presentDisabled && "opacity-50"
                )}
              />
            </Button>
          }
        </div>
      </div>
      {warningStale &&
      <div className="overflow-x-hidden pl-2 pt-2  text-2xs w-full">
        
        <AiFillWarning className="inline text-yellow-700" /> Can’t seem to find any peers to download this file from.
        <button className="underline font-bold">Reload torrent ↻</button>
      </div>
      }
    </div>
  );
}

const Button = ({
  disabled = false,
  className = "",
  progress = null,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        "relative torrent-button",
        disabled && "bg-gray-100",
        !disabled && "bg-white hover:bg-gray-100 shadow",
        className
      )}
    >
      {progress ? (
        <div
          className="absolute rounded-l-lg  z-0 left-0 top-0 bottom-0 bg-green-100 border border-green-600"
          style={{
            width: progress * 100 + "%",
          }}
        ></div>
      ) : null}
      <div className="relative z-10">{children}</div>
    </button>
  );
};

export default TorrentBoat;
