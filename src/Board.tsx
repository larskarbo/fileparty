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
import Media from './Media';
import classNames from 'classnames';
import { AiOutlineBulb, AiOutlineFrown, AiOutlineSmile } from "react-icons/ai";

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

  const ref = useMemo(() => firebase.database().ref(`boards/${boardId}`), [
    boardId,
  ]);
  useBeforeUnload(evt => {
    /* Do some checks here if you like */
    return "Are you sure you want to quit? You might lose the files you have added!"; // Suppress reload
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
    // return () => ref.off()
  }, [boardId]);

  useEffect(() => {
    // setLoaded(false);
    ref.child("playingNow").on("value", (snapshot) => {
      const data = snapshot.val();

      setPlayingNow(data);
      console.log(torrents)
    });
    // return () => ref.off()
  }, [boardId]);




  const onDrop = useCallback(acceptedFiles => {
    // console.log("🚀 ~ acceptedFiles", ))
    const aFiles = [...Array.from(acceptedFiles)]
    // return
    // Do something with the files
    setRawFiles((rawFiles) => [
      ...rawFiles,
      ...aFiles.map((df) => ({
        file: df,
        id: Math.round(Math.random() * 100000),
      })),
    ]);
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeTorrent = (magnet) => {
    client.remove(magnet)
    setTorrents(torrents.filter(
      ({ magnetURI }) => magnet != magnetURI
    ));
  }

  const removeTorrentByInfoHash = (infoHashToDelete) => {
    client.remove(infoHashToDelete)
    setTorrents(torrents.filter(
      ({ infoHash }) => infoHashToDelete != infoHash
    ));
  }

  return (
    <>
      <div className={"flex flex-col-reverse lg:flex-row flex-grow rounded bg-white  border border-gray-300 shadow-lg " + (isDragActive && "border-yellow-500 border-dashed")}>
        <div className="p-6 lg:w-96 rounded-l flex flex-col md:flex-row lg:flex-col">
          <div className="flex flex-col md:w-1/2 md:pr-8 lg:p-0 lg:w-full">
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

          </div>
          <div className="flex flex-col justify-start md:w-1/2 lg:w-full">
            <h2 className="text-xl font-semibold">Files</h2>
            {Object.entries(files).map(([key, file]: [string, any]) => (
              <TorrentBoat
                key={key}
                itemKey={key}
                torrent={torrents.find(
                  ({ magnetURI }) => file.magnet == magnetURI
                )}
                onFinish={() => {
                  setTorrents(torrents.map(torrent => {
                    if (file.magnet == torrent.magnetURI) {
                      torrent.done = true
                    }
                    return torrent
                  }));
                }}
                user={user}
                file={file}
                playingNow={playingNow}
                client={client}
                onSetTorrent={(torrent) => {
                  setTorrents([...torrents, torrent]);
                }}
                onRemoveTorrent={() => removeTorrent(file.magnet)}
                onDelete={(torrent) => {
                  try {
                    client.remove(file.magnet)
                  } catch (_) { }
                  ref.child("items").child(key).remove();
                  if (playingNow.key == key) {
                    ref.child("playingNow").set({})
                  }
                }}
                onPlay={() => {
                  ref.child("playingNow").set({
                    key,
                    state: "paused",
                    position: 0
                  });
                }}
                onUnPlay={() => {
                  ref.child("playingNow").set(null);
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
                onRemoveTorrentByInfoHash={(infoHash) => removeTorrentByInfoHash(infoHash)}
                onSetTorrent={(torrent) => {
                  // check if it already exists
                  console.log(torrent.magnetURI)
                  // files.forEach(t => console.log("mur", t.magnetURI))
                  console.log("files", files)

                  setTorrents([...torrents, torrent]);
                  if (!Object.values(files).find((f: any) => f.magnet == torrent.magnetURI)) {
                    const newItemRef = ref.child("items").push();
                    newItemRef.set({
                      name: rf.file.name,
                      magnet: torrent.magnetURI,
                      size: rf.file.size,
                      type: whichType(rf.file),
                      user: user.uid
                    });
                  }
                  setRawFiles((rawFiles) =>
                    rawFiles.filter((r) => r.id != rf.id)
                  );
                }}
              />
            ))}

            <div {...getRootProps()} className={"mt-12 text-xs h-24 flex flex-col justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-600 bg-gray-100 " + (isDragActive && " border-yellow-500")}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files to add them ...</p> :

                  <>
                    <p>Drag and drop <strong>images</strong>, <strong>audio</strong>, <strong>video</strong> or other files here, or click to select</p>
                  </>
              }
            </div>


          </div>

        </div>

        <Media playingNow={playingNow} torrents={torrents} files={files}
          onSetPlayingNow={(obj) => {
            ref.child("playingNow").set({
              ...playingNow,
              ...obj
            });
          }}
        />
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-between pt-5 pb-6 ">

        <div className=" ml-2 text-xs pr-4 text-gray-700 opacity-80">
          Powered by{" "}
          <a
            target="_blank"
            className="text-blue-600 "
            href="https://webtorrent.io/"
          >
            WebTorrent
            </a>{" "}(
              <FaDownload className="inline m-auto" size={8} />{" "}
          {prettyBytes(downloadSpeed || 0) + "/s "}
          <FaUpload className="inline m-auto" size={8} />{" "}
          {prettyBytes(uploadSpeed || 0) + "/s) "}
            | By{" "}
          <a
            target="_blank"
            className=" text-blue-600"
            href="https://larskarbo.no"
          >
            larskarbo
            </a>
        </div>
        <Feeback />
      </div>
    </>
  );
}

export default Board;


const moods = ["🙂", "👺", "💡"]
const Feeback = () => {
  const [mood, setMood] = useState(moods[0])
  const [text, setText] = useState("")
  const [isFocus, setIsFocus] = useState(false)
  const [first, setFirst] = useState(true)

  const onSubmit = e => {
    e.preventDefault()
    setText("")
    if (first) {
      setFirst(false)
      fetch(process.env.REACT_APP_FEEDBACK_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ text: mood + " Feedback: " + text })
      })

    } else {
      setFirst(true)
      fetch(process.env.REACT_APP_FEEDBACK_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ text: "Email: " + text })
      })
    }
  }

  return <div className="bg-white max-w-2xl mb-2 font-light text-gray-600 flex-grow h-6 flex overflow-hidden text-xs items-center rounded-lg border border-gray-300 w-full ">
    {!first &&<div className="px-3 py-1 bg-gray-100  ">
      {first ? "How do you feel?" : "Thanks! Put your email I'll get back to you:"}
    </div>}
    {first && moods.map((m, i) => (
      <button key={m} className={classNames("px-2   border-gray-300 h-full",
        mood == m && "bg-gray-100",
        i!=0&&"border-l"
      )}
        onClick={(e) => { setMood(m) }}
      >
        {m == "🙂" && <AiOutlineSmile />}
        {m == "👺" && <AiOutlineFrown />}
        {m == "💡" && <AiOutlineBulb />}
      </button>

    ))}

    <form onSubmit={onSubmit} className="flex flex-grow h-full relative border-l  border-gray-300 ">
      <input
        onFocus={() => setIsFocus(true)}
        onBlur={() => setTimeout(() => setIsFocus(false), 300)}
        value={text} onChange={(e) => setText(e.target.value)}
        className="w-full h-full pl-2" placeholder={first ? "Type instant feedback..." : "you@example.com"} type="text" />
      {(text.length > 0 && isFocus) &&
        <button type="submit" onClick={onSubmit} className="whitespace-nowrap bg-blue-200 rounded-l-lg  px-3 py-0 text-blue-700" >
          {isFocus ? "Press enter to send" : "Send"}
        </button>

      }
    </form>
  </div>
}

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
          <li className="text-xs mb-3"><span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">Anyone</span> can delete files</li>
          <li className="text-xs"><span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">Anyone</span> can set playback</li>

        </ul>
      </div>}
  </>
}



const whichType = (file) => {
  if (file.type.includes("video")) {
    return "video"
  } else if (file.type.includes("image")) {
    return "image"
  } else if (file.type.includes("audio")) {
    return "audio"
  } else {
    return "file"
  }
}