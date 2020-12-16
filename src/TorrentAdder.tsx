import React, { useEffect, useRef, useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import WebTorrent from "webtorrent";
import prettyBytes from "pretty-bytes"

function TorrentAdder({ rawFile,  client, onSetTorrent, onDestroy }) {

  useEffect(() => {
    if (rawFile) {
      client.seed([rawFile.file], {}, function (torrent) {
        console.log("🚀 ~ torrent", torrent)
        onSetTorrent(torrent);
      }, function(torrent){
        torrent.on("error", function(err) {
          if(err.message.includes("duplicate")){
            alert("Can't add duplicate file")
            onDestroy()
          } else {
            console["log"]("error!", err.message)

          }
        })
      })
    }
  }, [])

  return (
    <div className={"flex flex-row h-12 mt-4"}>
      <div  className="w-12 flex justify-center">
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
