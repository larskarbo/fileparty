import React, { useEffect, useRef, useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import WebTorrent from "webtorrent";
import prettyBytes from "pretty-bytes"

function TorrentBoat({ torrent, mainRef}) {
  const myRef = useRef(null);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadSpeed(torrent.downloadSpeed);
      setUploadSpeed(torrent.uploadSpeed);
      setProgress(torrent.progress);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (myRef.current) {
      console.log(torrent);

      console.log("🚀 ~ torrent.files", torrent.files);
      myRef.current.innerHTML = "";
      torrent.files[0].appendTo(myRef.current, (error) => {
        if (error) {
          console.log("🚀 ~ error", error);
        }
      });
    }
  }, [torrent.magnetURI, myRef]);

  return (
    <div className="flex flex-row h-12 mt-4">
      <div ref={myRef} className="w-12 flex justify-center">
        <img  src="https://via.placeholder.com/150" />
      </div>
      <div className="flex flex-col flex-grow w-56 pl-2 pt-1">
        <div className="h-4 flex flex-row">
          <div className="text-sm overflow-hidden">{torrent.files[0].name}</div>
        </div>
        <div className="flex flex-row text-gray-400">
          <div className="text-xs  flex flex-row ">
            <FaDownload className="m-auto mr-1" size={8} /> {downloadSpeed ? prettyBytes(downloadSpeed) + "/s" : "-"}
          </div>
          <div className="ml-2 text-xs flex flex-row ">
            <FaUpload className="m-auto mr-1" size={8} /> {uploadSpeed ? prettyBytes(uploadSpeed) + "/s" : "-"}
          </div>
        </div>
        <div className="mt-0 rounded-xl w-full z-10 h-2 bg-gray-300 relative">
          <div
            className={
              "top-0 left-0 bottom-0 z-0 bg-blue-400 absolute rounded-l-xl " +
              (progress == 1 ? "rounded-xl" : "")
            }
            style={{
              width: progress * 100 + "%",
            }}
          ></div>
        </div>
      </div>
      <div className=" flex flex-row w-12 text-center  center">
        <button onClick={() => {
          mainRef.current.innerHTML= ""
          torrent.files[0].appendTo(mainRef.current)
        }} className="m-auto w-8 hover:bg-gray-100 rounded p-2 bg-gray-200">
          ➡️
        </button>
      </div>
    </div>
  );
}

export default TorrentBoat;
