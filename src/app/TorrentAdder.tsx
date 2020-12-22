import React, { useEffect, useRef, useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import WebTorrent from "webtorrent";
import prettyBytes from "pretty-bytes"

function TorrentAdder({ rawFile, client, onSetTorrent, onDestroy, onRemoveTorrentByInfoHash }) {

  useEffect(() => {
    if (rawFile) {
      console.log("🚀 ~ rawFile.file", rawFile.file)
      client.seed([rawFile.file], { name: rawFile.file.name, announce: ["wss://tracker.fileparty.co"] }, function (torrent) {
        console.log("🚀 ~ torrent", torrent)
        onSetTorrent(torrent);
      }, function (torrent) {
        torrent.on("error", function (err) {
          console.log("🚀 ~ torrent", torrent)
          if (err.message.includes("duplicate")) {
            const infoHash = err.message.split("Cannot add duplicate torrent ")[1]
            console.log("🚀 ~ infoHash", infoHash)
            onRemoveTorrentByInfoHash(infoHash)
            // if(client.torrents.find(t=> t.magnetURI))
            //try again
            client.seed([rawFile.file], { name: rawFile.file.name }, function (torrent) {
              console.log("🚀 ~ torrent", torrent)
              onSetTorrent(torrent);
            }, function (torrent) {
              onDestroy()
            })


          } else {
            console["log"]("error!", err.message)

          }
        })
      })
    }
  }, [])

  return (
    <div className={"flex flex-row h-12 mt-4"}>
      <div className="w-12 flex justify-center">
        <img src="https://via.placeholder.com/150" />
      </div>
      <div className="flex flex-col flex-grow w-56 pl-2 pt-1">
        <div className="h-4 flex flex-row">
          <div onClick={() => {
          }} className={"text-sm overflow-hidden"}>Adding {rawFile.name}...</div>
        </div>
      </div>
    </div>
  );
}

export default TorrentAdder;
