import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCircle,
  FaDownload,
  FaSpinner,
  FaUpload,
} from "react-icons/fa";
import { throttle } from 'lodash';
import { HiDotsVertical } from "react-icons/hi";
import { AiFillWarning, AiOutlineReload } from "react-icons/ai";
import WebTorrent from "webtorrent";
import prettyBytes from "pretty-bytes";
import audio from "./graphics/audio-file.svg";
import video from "./graphics/video-file.svg";
import image from "./graphics/image-file.svg";
import file from "./graphics/file-file.svg";
// import sendToPresenter from "./graphics/send-to-presenter.svg";
import SendToPresenter from "./graphics/send-to-presenter.inline.svg";
import classNames from "classnames";

import useClickOutside from 'use-click-outside';

const icons = {
  audio,
  video,
  image,
  file,
};

function TorrentBoat({
  itemKey,
  onSetTorrent,
  playingNow,
  file,
  onDelete,
  client,
  onPlay,
  onUnPlay,
  onFinish,
  torrent,
  onRemoveTorrent,
  user,
}) {
  const myRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [warningStale, setWarningStale] = useState(false);
  const [startedDownloading, setStartedDownloading] = useState(false);

  const streamable = file.name.includes(".mp4")
  
  useEffect(() => {
    if (!startedDownloading) {
      return;
    }
    if (torrent) {
      console.log("torrent already exists");
      return;
    }
    client.add(file.magnet, function (torrent) {
      onSetTorrent(torrent);
    });
  }, [startedDownloading]);

  useEffect(() => {
    if (startedDownloading && progress == 0) {
      const timeout = setTimeout(() => {
        setWarningStale(true)
      }, 4000)
      return () => clearTimeout(timeout)
    } else {
      if (warningStale) {
        setWarningStale(false)
      }
    }
  }, [startedDownloading, progress]);

  useEffect(() => {
    if (!torrent) {
      return;
    }
    console.log("adding bunch of handlers")
    setProgress(torrent.progress);

    torrent.on('download', throttle(() => {
      setProgress(torrent.progress);
    }, 1000, { 'trailing': true }))
    torrent.on('noPeers', function (announceType) {
      console.log("no peers")
    })
    torrent.on('done', function () {
      onFinish();
    })
  }, [torrent]);

  const reload = () => {
    onRemoveTorrent()
    setStartedDownloading(false)
    setWarningStale(false)
  }

  const presentDisabled = false;
  const playing = playingNow?.key == itemKey

  return (
    <div
      className={classNames("py-2 rounded",
        playing && "bg-gray-100",
        warningStale && "border border-yellow-600 bg-yellow-50 py-2")}
      style={{
        marginLeft: -20,
        marginRight: -20,
        paddingRight: 10,
      }}
    >
      <div className="flex h-12 flex-row">

        <div className="w-6 flex relative items-center justify-center">
          <DropdownMenu options={[
            { name: "Delete", onClick: onDelete }
          ]} />
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
                // + (playing && " font-bold")
              }
            >
              {file.name}
            </div>
          </div>
          <div>
            <span className={"p-1 px-2 rounded-xl uppercase font-bold  text-2xs text-gray-400 "
              + (playing ? "bg-gray-200" : "bg-gray-100")
            }>
              {file.type}
            </span>
            {streamable&&
            <span className={"p-1 px-2 ml-2 rounded-xl uppercase font-bold  text-2xs text-red-400 bg-red-100" }>
              STREAMABLE
            </span>
        }
          </div>
        </div>
        <div className=" flex  flex-row text-center justify-end items-center">
          {!torrent?.done &&
            <>
              {startedDownloading ? (
                <Button
                  // className="mr-10"
                  progress={progress}
                >
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
                    <div className="flex flex-row items-center whitespace-nowrap text-2xs font-bold text-gray-700">
                      LOAD ({prettyBytes(file.size)}) <FaArrowDown className="ml-1" />
                    </div>
                  </Button>
                )}
            </>
          }
          {torrent?.done &&
            <Button
              onClick={() => {

                if (playing) {
                  onUnPlay()
                } else {
                  onPlay();
                }
              }}
              disabled={presentDisabled}
              inverted={playing}
              className={classNames("ml-2", playing && "bg-gray-600")}
            >
              <SendToPresenter
                fill={playing ? "white" : "black"}
                stroke={playing ? "white" : "black"}
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
        <div className="overflow-x-hidden pl-2 pt-2  text-2xs w-full text-gray-700">

          <AiFillWarning className="inline text-yellow-700 " /> Can’t seem to find any peers to download this file from.{" "}
          <button onClick={reload} className="underline font-bold">Reset torrent ↻</button>
        </div>
      }
    </div>
  );
}

const DropdownMenu = ({ options }) => {

  const [contextMenu, setContextMenu] = useState(false);
  const ref = useRef();
  useClickOutside(ref, () => setContextMenu(false));

  return (
    <>
      <button
        ref={ref}
        onMouseDown={() => {
          setContextMenu(!contextMenu)
        }}
        className={"border border-transparent hover:border-gray-400 rounded-sm p-1 m-auto " + (contextMenu && "bg-gray-700")}>
        <HiDotsVertical className={contextMenu ? "text-white" : "text-gray-500"} />
      </button>
      {
        contextMenu &&

        <div className="origin-top-right absolute left-8 top-0 mt-2 w-40 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <div className="py-1">
            {options.map(o => (
              <button key={o.name}
                onClick={o.onClick}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                {o.name}
              </button>

            ))}
          </div>
        </div>
      }
    </>
  )
}

const Button = ({
  disabled = false,
  inverted = false,
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
        !disabled && "bg-white  shadow",
        (!inverted && !disabled) && "hover:bg-gray-100",
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