import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WebTorrent from "webtorrent";

import { useDropzone } from "react-dropzone";
import TorrentBoat from "./TorrentBoat";
import useClipboard from "react-use-clipboard";

import { FaCheck, FaCopy, FaDownload, FaLink, FaLock, FaUpload } from "react-icons/fa";
import { useParams } from "react-router";
import useBeforeUnload from "use-before-unload"
import firebase from "firebase/app";
import TorrentAdder from "./TorrentAdder";
import prettyBytes from 'pretty-bytes';

export interface File {
  id: number;
  name: string;
  magnet: string;
  torrent: any;
}

function setUpClient() {
  const client = new WebTorrent()
  client.on('error', function (err) {
    console["log"]("🚀 ~ err", err)
    // alert("Fatal error")
  })
  return client
}

function Board({ user }) {
  const { boardId }: any = useParams();

  var client = useMemo(setUpClient, [])

  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  
  useEffect(() => {
    if (!client) {
      return;
    }
    const interval = setInterval(() => {
      setDownloadSpeed(client.downloadSpeed);
      setUploadSpeed(client.uploadSpeed);
    }, 1000);
    return () => clearInterval(interval);
  }, [client]);



  const link = "https://ultrashare.co/" + boardId;
  const [isCopied, setCopied] = useClipboard(link);

  // const [torrents, setTorrents] = useState([]);
  const [files, setFiles] = useState({});
  const [playingNow, setPlayingNow] = useState(null);
  const [rawFiles, setRawFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [torrents, setTorrents] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const mainRef = useRef();

  const ref = useMemo(() => firebase.database().ref(`boards/${boardId}`), [
    boardId,
  ]);
  useBeforeUnload(evt => {
    /* Do some checks here if you like */
    if (isHost) {
      return "Are you sure you want to quit? You might lose the files you have added!"; // Suppress reload
    }
  });

  useEffect(() => {
    // setLoaded(false);

    
    ref.child('counter')
    .set(firebase.database.ServerValue.increment(1))


    ref.child("items").on("value", (snapshot) => {
      const data = snapshot.val();

      setFiles(data || {});
      setLoaded(true);
      // updateStarCount(postElement, data);
    });
    ref.child("user").on("value", (snapshot) => {
      const data = snapshot.val();
      console.log("🚀 ~ data", data)

      setIsHost(data == user.uid);
      // updateStarCount(postElement, data);
    });
    // return () => ref.off()
  }, [boardId]);

  useEffect(() => {
    // setLoaded(false);
    ref.child("playingNow").on("value", (snapshot) => {
      const data = snapshot.val();

      setPlayingNow(data);
    });
    // return () => ref.off()
  }, [boardId]);


  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setRawFiles((rawFiles) => [
      ...rawFiles,
      ...[...acceptedFiles].map((df) => ({
        file: df,
        id: Math.round(Math.random() * 100000),
      })),
    ]);
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


  return (
    <div className={"flex flex-grow rounded bg-white  border border-gray-300 shadow-lg " + (isDragActive && "border-yellow-500 border-dashed")}>
      <div className="p-6 w-100 rounded-l flex justify-between flex-col">
        <div>
          {isHost &&
            <div className="font-normal">You are hosting this room</div>
          }
          <div className="flex flex-row text-xs mb-3 mt-2">
            <div
              className="bg-gray-100 p-2 flex flex-row text-gray-500
            border-t border-b border-l rounded-l
            "
            >
              <FaLink className="ml-0 m-auto" />
            </div>
            <input
              className=" p-2 border-t border-b flex flex-grow"
              type="text"
              value={link}
              onChange={() => { }}
            />
            <button
              onClick={setCopied}
              className="bg-gray-0 p-2 flex flex-row text-gray-500
            border-t border-b border-r border-l rounded-r"
            >
              copy{" "}
              {isCopied ? (
                <FaCheck className="ml-1 m-auto" />
              ) : (
                  <FaCopy className="ml-1 m-auto" />
                )}
            </button>
          </div>

          <PermSettings />
          <h2 className="text-xl font-semibold">Files</h2>
          {Object.entries(files).map(([key, file]: [string, any]) => (
            <TorrentBoat
              mainRef={mainRef}
              key={key}
              itemKey={key}
              torrent={torrents.find(
                ({ magnetURI }) => file.magnet == magnetURI
              )}
              isHost={isHost}
              user={user}
              file={file}
              playingNow={playingNow}
              client={client}
              onSetTorrent={(torrent) => {
                setTorrents([...torrents, torrent]);
              }}
              onDelete={(torrent) => {
                client.remove(file.magnet)
                ref.child("items").child(key).remove();
              }}
              onPlay={() => {
                ref.child("playingNow").set({
                  key,
                });
              }}
            />
          ))}
          {rawFiles.map((rf) => (
            <TorrentAdder
              client={client}
              rawFile={rf}
              key={rf.id}
              onDestroy={() => {
                setRawFiles((rawFiles) =>
                  rawFiles.filter((r) => r.id != rf.id)
                );
              }}
              onSetTorrent={(torrent) => {
                setTorrents([...torrents, torrent]);
                const newItemRef = ref.child("items").push();
                console.log("🚀 ~ rf.file", rf.file)
                console.log("🚀 ~ torrent", torrent)
                newItemRef.set({
                  name: rf.file.name,
                  magnet: torrent.magnetURI,
                  size: rf.file.size,
                  type: whichType(rf.file),
                  user: user.uid
                });
                setRawFiles((rawFiles) =>
                  rawFiles.filter((r) => r.id != rf.id)
                );
              }}
            />
          ))}

          <div {...getRootProps()}  className={"mt-12 text-sm h-24 border-4 border-dashed border-gray-200 rounded-xl p-3 text-gray-600 bg-gray-100 " + (isDragActive &&" border-yellow-500")}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files to add them ...</p> :
                <p>Drag and drop files here, or click to select</p>
            }
          </div>
        </div>

        <div className="text-xs text-gray-700">
          Powered by{" "}
          <a
            target="_blank"
            className="text-blue-600 "
            href="https://webtorrent.io/"
          >
            WebTorrent
          </a>{" "}
            <FaDownload className="inline m-auto mr-1" size={8} />{" "}
            {downloadSpeed ? prettyBytes(downloadSpeed) + "/s " : "- "}
            <FaUpload className="inline m-auto mx-1" size={8} />{" "}
            {uploadSpeed ? prettyBytes(uploadSpeed) + "/s " : "- "}
          | By{" "}
          <a
            target="_blank"
            className=" text-blue-600"
            href="https://larskarbo.no"
          >
            larskarbo
          </a>
        </div>
      </div>
      <div
        ref={mainRef}
        className="flex justify-center  rounded-r flex-grow bg-gray-200"
      >
        <div className="flex flex-col  w-full text-center align-middle justify-center">

          <div className="bg-gray-800 w-full" style={{
            backgroundColor: "#4B4B4B"
          }}>
            <div className="h-64 flex items-center justify-center">
              
              <div className="font-light text-2xs text-gray-100">
                The host controls this presenter screen 
              </div>
            </div>
            <div className="h-8 border-t border-gray-100">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;

const PermSettings = () => {

  const [permShow, setPermShow] = useState(false);
  return <>
    <button
      onClick={() => setPermShow(!permShow)}
      className="mb-4 focus:outline-none rounded-3xl flex flex-row items-center justify-center text-xs py-1 px-4 bg-blue-50 hover:bg-gray-200 transition duration-150">
      <FaLock size={10} className="text-gray-500 mr-1" /> {permShow ? "Hide" : "Show"} permission settings
    </button>
    {permShow &&
      <div className="border mb-3 border-gray-300 rounded-sm bg-gray-100 p-4">
        <ul>
          <li className="text-xs mb-3"><span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">Anyone</span> can join</li>
          <li className="text-xs mb-3"><span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">Anyone</span> can add files</li>
          <li className="text-xs mb-3"><span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">Anyone</span> can download files</li>
          <li className="text-xs mb-3"><span className="p-1 rounded font-bold text-x text-yellow-700 bg-yellow-200">Host</span> can delete files</li>
          <li className="text-xs"><span className="p-1 rounded font-bold text-x text-yellow-700 bg-yellow-200">Host</span> can set playback</li>

        </ul>
      </div>}
  </>
}

const whichType=(file)=> {
  if(file.type.includes("video")){
    return "video"
  } else if(file.type.includes("image")){
    return "image"
  } else if(file.type.includes("audio")){
    return "audio"
  } else {
    return "file"
  }
}