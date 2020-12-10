import React, { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import cryptoRandomString from 'crypto-random-string';
import dragDrop from 'drag-drop'
import WebTorrent from 'webtorrent'

import { useDropzone } from 'react-dropzone'
import TorrentBoat from './TorrentBoat';
import logo from "./logo.svg"
import useClipboard from "react-use-clipboard";

import { FaCheck, FaCopy, FaDownload, FaLink, FaUpload } from "react-icons/fa"

var client = new WebTorrent()
function Host() {
  const link = "https://ultrashare.co/fjdsjo"
  const [isCopied, setCopied] = useClipboard(link);

  const [torrents, setTorrents] = useState([])
  const [dragging, setDragging] = useState(false)
  const mainRef = useRef()
  const [magnetQueue, _] = useState([
    "magnet:?xt=urn:btih:68ad5577342989b214579547bb37a7fda5f6e9fc&dn=muno.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337g%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
    , "magnet:?xt=urn:btih:a48c550f78ae41906240a3db8a63d8240823a8d8&dn=CleanShot+2020-12-09+at+22.15.18%402x.png&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
    , "magnet:?xt=urn:btih:4bb1fae746f1becbf9d8c10b8a64087bae51e146&dn=Quarter-Life+Crisis+-+Waterfall+(feat.+Charlie+Martin+of+Hovvdy)+%5BOfficial+Audio%5D.mp3&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
  ])

  const onDrop = useCallback(files => {
    // Do something with the files
    console.log("🚀 ~ file: Host.tsx ~ line 12 ~ files", files)
    client.seed(files, function (torrent) {
      setTorrents([...torrents, torrent])
    })
  }, [])

  useEffect(() => {
    // When user drops files on the browser, create a new torrent and start seeding it!
    if (torrents.length) {
      return
    }
    magnetQueue.forEach((magnet) => {
      client.add(magnet, function (torrent) {
        console.log("🚀 ~ torrent", torrent)
        setTorrents(torrents => [...torrents, torrent])
      })
    })
  }, [magnetQueue])


  return (
    <div className="flex flex-col bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 flex-grow h-screen p-12"
    //  {...getRootProps()}
    >
      <div className=" py-4">
        <a href="/">
          <img className="w-12" src={logo} />

        </a>
      </div>

      <div className="flex flex-grow rounded bg-white  border border-gray-300 shadow-lg "
      >
        <div className="p-6 w-80 rounded-l">
          <div className="font-normal">You are hosting this room</div>
          <div className="flex flex-row text-xs mb-6 mt-2">
            <div className="bg-gray-100 p-2 flex flex-row text-gray-500
            border-t border-b border-l rounded-l
            "><FaLink className="ml-0 m-auto" /></div>
            <input
              className=" p-2 border-t border-b flex flex-grow"
              type="text" value={link} onChange={() => { }} />
            <button onClick={setCopied} className="bg-gray-0 p-2 flex flex-row text-gray-500
            border-t border-b border-r border-l rounded-r
  ">copy {isCopied ? <FaCheck className="ml-1 m-auto" /> : <FaCopy className="ml-1 m-auto" />}</button>
          </div>
          <h2 className="text-xl font-semibold">Files</h2>
          {torrents.map(torrent => (
            <TorrentBoat mainRef={mainRef} key={torrent.magnetURI} torrent={torrent} />
          ))}

          <div className="pt-6">
            <input type="file" onChange={(e) => onDrop(e.target.files)} />
          </div>

        </div>
        <div ref={mainRef} className="p-6 flex justify-center  rounded-r flex-grow bg-gray-200">
          <div className="flex flex-col text-center align-middle justify-center">
            <div className="font-semibold text-xl">Universal playback</div>
            <div className="font-light text-gray-700">The host decides what is played here</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Host;
