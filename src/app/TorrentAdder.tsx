import React, { useEffect, useRef, useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import prettyBytes from "pretty-bytes"

function TorrentAdder({ rawFile, client, onSetTorrent, onDestroy, onRemoveTorrentByInfoHash }) {

  useEffect(() => {
    if (rawFile) {
      
    }
  }, [])

  return (
    <div className={"flex flex-row h-12 mt-4"}>
      <div className="w-12 flex justify-center">
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
