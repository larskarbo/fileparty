import classNames from "classnames";
import prettyBytes from "pretty-bytes";
import React, { useEffect, useRef, useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { FaArrowDown, FaCircle, FaDownload } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import useClickOutside from "use-click-outside";
// @ts-ignore
import audio from "./graphics/audio-file.svg";
// @ts-ignore
import file from "./graphics/file-file.svg";
// @ts-ignore
import image from "./graphics/image-file.svg";
// @ts-ignore
import video from "./graphics/video-file.svg";

const icons = {
  audio,
  video,
  image,
  file,
};

function TorrentBoat({
  onSetTorrent,
  done,
  setDone,
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
  const [startedDownloading, setStartedDownloading] = useState(true);

  const streamable = file.name.includes(".mp4");

  useEffect(() => {
    if (!startedDownloading) {
      return;
    }
    if (torrent) {
      console.log("torrent already exists");
      return;
    }
    console.log("ADDING");
    console.log("file.magnet: ", file.magnet);
    client.add(
      file.magnet,
      {
        announce: ["wss://tracker.fileparty.co"],
      },
      function (torrent) {
        torrent.on("done", () => {
          // @ts-ignore
          window.plausible("torrent-done");
        });

        onSetTorrent(torrent);
      }
    );
  }, [startedDownloading, torrent?.magnetURI]);

  useEffect(() => {
    if (startedDownloading && progress == 0) {
      const timeout = setTimeout(() => {
        setWarningStale(true);
        // @ts-ignore
        window.plausible("torrent-stale");
      }, 8000);
      return () => clearTimeout(timeout);
    } else {
      if (warningStale) {
        setWarningStale(false);
      }
    }
  }, [startedDownloading, progress]);

  useEffect(() => {
    console.log("TORRENT CHANGED");
    if (!torrent) {
      console.log("TORRENT false", torrent);
      return;
    }
    console.log("adding bunch of handlers");
    setProgress(torrent.progress);

    torrent.on("noPeers", function (announceType) {
      console.log("no peers");
    });

    if (torrent.progress == 1) {
      setDone(true);
    } else {
      torrent.on("download", () => {
        setProgress(torrent.progress);
        console.log(torrent.progress);
        if (torrent.progress == 1) {
          setDone(true);
        }
      });
      torrent.on("done", function () {
        setDone(true);
      });
    }
  }, [torrent?.magnetURI]);

  const reload = () => {
    console.log(torrent);
    onRemoveTorrent();
    setStartedDownloading(false);
    setWarningStale(false);
  };

  const presentDisabled = false;
  const playing = !!playingNow;

  return (
    <div
      className={classNames(
        "py-2 rounded",
        "bg-white border border-gray-200 shadow pr-2",
        "w-96",
        warningStale && "border border-yellow-600 bg-yellow-50 py-2"
      )}
      style={{}}
    >
      <div className="flex h-12 flex-row">
        <div className="w-6 flex relative items-center justify-center">
          <DropdownMenu options={[{ name: "Remove", onClick: onDelete }]} />
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
            <span
              className={
                "p-1 px-2 rounded-xl uppercase font-bold  text-2xs text-gray-400 " +
                (playing ? "bg-gray-200" : "bg-gray-100")
              }
            >
              {file.type}
            </span>
            {streamable && (
              <span
                className={
                  "p-1 px-2 ml-2 rounded-xl uppercase font-bold  text-2xs text-red-400 bg-red-100"
                }
              >
                STREAMABLE
              </span>
            )}
          </div>
        </div>
        <div className=" flex  flex-row text-center justify-end items-center">
          {!done && (
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
                    LOAD ({prettyBytes(file.size)}){" "}
                    <FaArrowDown className="ml-1" />
                  </div>
                </Button>
              )}
            </>
          )}
          {done && (
            <Button
              onClick={() => {
                torrent.files[0].getBlobURL(function (err, url) {
                  if (err) throw err;
                  // Create an invisible A element
                  const a = document.createElement("a");
                  a.style.display = "none";
                  document.body.appendChild(a);

                  // Set the HREF to a Blob representation of the data to be downloaded
                  a.href = url;

                  // Use download attribute to set set desired file name
                  a.setAttribute("download", file.name);

                  // Trigger the download by simulating click
                  a.click();

                  document.body.removeChild(a);
                });
              }}
            >
              <div className="flex flex-row items-center whitespace-nowrap text-2xs font-bold text-gray-700">
                SAVE <FaDownload className="ml-1" />
              </div>
            </Button>
          )}
        </div>
      </div>
      {warningStale && (
        <div className="overflow-x-hidden pl-2 pt-2  text-2xs w-full text-gray-700">
          <AiFillWarning className="inline text-yellow-700 " /> Can’t seem to
          find any peers to download this file from.{" "}
          <button onClick={reload} className="underline font-bold">
            Reset torrent ↻
          </button>
        </div>
      )}
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
          setContextMenu(!contextMenu);
        }}
        className={
          "border border-transparent hover:border-gray-400 rounded-sm p-1 m-auto " +
          (contextMenu && "bg-gray-700")
        }
      >
        <HiDotsVertical
          className={contextMenu ? "text-white" : "text-gray-500"}
        />
      </button>
      {contextMenu && (
        <div
          className="origin-top-right absolute left-8 top-0 mt-2 w-40 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1">
            {options.map((o) => (
              <button
                key={o.name}
                onClick={o.onClick}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

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
        !inverted && !disabled && "hover:bg-gray-100",
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
