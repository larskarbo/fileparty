import React, {
  useCallback,
  useEffect,
  useMemo,
  useContext,
  useRef,
  useState,
} from "react";

import { useDropzone } from "react-dropzone";
import TorrentBoat from "./TorrentBoat";
import useClipboard from "react-use-clipboard";

import {
  FaCheck,
  FaCopy,
  FaDownload,
  FaLink,
  FaLock,
  FaUpload,
} from "react-icons/fa";
import useBeforeUnload from "use-before-unload";
import firebase from "firebase/app";
import TorrentAdder from "./TorrentAdder";
import prettyBytes from "pretty-bytes";
import Media from "./Media";
import classNames from "classnames";
import { AiOutlineBulb, AiOutlineFrown, AiOutlineSmile } from "react-icons/ai";
import { useParams } from "@reach/router";
import { UserContext } from "../templates/FirebaseInit";
import Layout from "./Layout";
import PresenterScreen from "./PresenterScreen";
import { client } from "./setUpClient";

export interface File {
  id: number;
  name: string;
  magnet: string;
  torrent: any;
}

function Board({ boardId }) {
  const { user } = useContext(UserContext);

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

  const link = "https://fileparty.co/" + boardId;
  const [isCopied, setCopied] = useClipboard(link);

  // const [torrents, setTorrents] = useState([]);
  const [file, setFile] = useState(null);
  const [playingNow, setPlayingNow] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [torrent, setTorrent] = useState(null);

  const ref = useMemo(() => firebase.database().ref(`boards/${boardId}`), [
    boardId,
  ]);

  // useBeforeUnload(evt => {
  //   /* Do some checks here if you like */
  //   return "Are you sure you want to quit? You might lose the files you have added!"; // Suppress reload
  // });

  useEffect(() => {
    // setLoaded(false);

    ref.child("counter").set(firebase.database.ServerValue.increment(1));

    ref.child("file").on("value", (snapshot) => {
      const data = snapshot.val();
      console.log('data: ', data);
      // if(!data || data.magnet != file?.magnet){
      //   client.torrents.forEach(torrent => {
      //     client.remove(torrent.magnetURI)
      //   })
      //   setTorrent(null)
      // }

      
      setFile(data || {});
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
      
    });
    // return () => ref.off()
  }, [boardId]);

  const onDrop = useCallback((acceptedFiles) => {
    const rawFile = acceptedFiles[0]
    client.torrents.forEach(torrent => {
      client.remove(torrent.magnetURI)
    })
    setTorrent(null);
    ref.child("file").set(null);
    client.seed([rawFile], {
      name: rawFile.name,
      announce: ["wss://tracker.fileparty.co"]
    }, function (torrent) {
      setTorrent(torrent);
      ref.child("file").set({
        name: rawFile.name,
        magnet: torrent.magnetURI,
        size: rawFile.size,
        type: whichType(rawFile),
        user: user.uid
      });
      ref.child("playingNow").set({
        state: "paused",
        position: 0
      });
    }, function (torrent) {
      torrent.on("error", function (err) {
        if (err.message.includes("duplicate")) {
          console.log("duplicate!!!")
          // const infoHash = err.message.split("Cannot add duplicate torrent ")[1]
          // // onRemoveTorrentByInfoHash(infoHash)
          // // if(client.torrents.find(t=> t.magnetURI))
          // //try again
          // client.seed([rawFile], {
          //   name: rawFile.name,
          //   announce: ["wss://tracker.fileparty.co"]
          // }, function (torrent) {
          //   console.log("added duplicate torrent", torrent)
          //   onSetTorrent(torrent);
          // }, function (torrent) {
          //   onDestroy()
          // })


        } else {
          console["log"]("error!", err.message)

        }
      })
    })
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });




  return (
    <Layout>
      <div className="flex flex-row text-xs mb-3 mt-2 max-w-sm">
        <div
          className="bg-gray-100 p-2 flex flex-row text-gray-500
            border-t border-b border-l rounded-l
            "
        >
          <FaLink className="ml-0 m-auto" />
        </div>
        <input
          className=" p-2 border-0 border-t border-b flex flex-grow"
          type=""
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
      

      <input {...getInputProps()} />

      <div
        className={
          "rounded bg-gray-200 relative flex flex-grow h-full border border-gray-300 shadow-lg " +
          (isDragActive && "border-yellow-500 border-dashed")
        }

        {...getRootProps()}
        {...(file && { onClick: undefined })}
      >
        
          {file?.name ?
            <>
              <div className="absolute z-20 left-2 bottom-10">
                <TorrentBoat
                  torrent={torrent?.magnetURI == file?.magnet ? torrent : null}
                  // onFinish={() => {
                  //   torrent.done = true
                  //   setTorrent(torrent);
                  // }}
                  user={user}
                  file={file}
                  playingNow={playingNow}
                  client={client}
                  onSetTorrent={(torrent) => {
                    setTorrent(torrent);
                  }}
                  onRemoveTorrent={() => {
                    client.torrents.forEach(torrent => {
                      client.remove(torrent.magnetURI)
                    })
                    setTorrent(null)
                  }}
                  onDelete={(torrent) => {
                    // try {
                    //   client.remove(file.magnet)
                    // } catch (_) { }
                    // ref.child("items").child(key).remove();
                    // if (playingNow?.key == key) {
                    //   ref.child("playingNow").set({})
                    // }
                  }}
                  onPlay={() => {
                  }}
                  onUnPlay={() => {
                  }}
                />
              </div>
              <Media

                isDragActive={isDragActive}
                playingNow={playingNow}
                torrent={torrent?.magnetURI == file?.magnet ? torrent : null}
                file={file}
                onSetPlayingNow={(obj) => {
                  ref.child("playingNow").set({
                    ...playingNow,
                    ...obj,
                  });
                }}
              />
            </>
            :

            !isDragActive && <p>
              Drag and drop <strong>images</strong>,{" "}
              <strong>audio</strong>, <strong>video</strong> or other
                files here, or click to select
              </p>


          }
          {isDragActive && (
            <div className="absolute opacity-50 bg-yellow-300 top-0 right-0 left-0 bottom-0 flex items-center justify-center">
              <p>Drop the files to add them ...</p>
            </div>
          )}

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
          </a>{" "}
          (
          <FaDownload className="inline m-auto" size={8} />{" "}
          {prettyBytes(downloadSpeed || 0) + "/s "}
          <FaUpload className="inline m-auto" size={8} />{" "}
          {prettyBytes(uploadSpeed || 0) + "/s) "}| By{" "}
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
    </Layout>
  );
}

export default Board;

const moods = ["🙂", "👺", "💡"];
const Feeback = () => {
  const [mood, setMood] = useState(moods[0]);
  const [text, setText] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [first, setFirst] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    setText("");
    if (first) {
      setFirst(false);
      fetch(process.env.GATSBY_FEEDBACK_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ text: mood + " Feedback: " + text }),
      });
    } else {
      setFirst(true);
      fetch(process.env.GATSBY_FEEDBACK_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ text: "Email: " + text }),
      });
    }
  };

  return (
    <div className="bg-white max-w-2xl mb-2 font-light text-gray-600 flex-grow h-6 flex overflow-hidden text-xs items-center rounded-lg border border-gray-300 w-full ">
      {!first && (
        <div className="px-3 py-1 bg-gray-100  ">
          {first
            ? "How do you feel?"
            : "Thanks! Put your email I'll get back to you:"}
        </div>
      )}
      {first &&
        moods.map((m, i) => (
          <button
            key={m}
            className={classNames(
              "px-2   border-gray-300 h-full",
              mood == m && "bg-gray-100",
              i != 0 && "border-l"
            )}
            onClick={(e) => {
              setMood(m);
            }}
          >
            {m == "🙂" && <AiOutlineSmile />}
            {m == "👺" && <AiOutlineFrown />}
            {m == "💡" && <AiOutlineBulb />}
          </button>
        ))}

      <form
        onSubmit={onSubmit}
        className="flex flex-grow h-full relative border-l  border-gray-300 "
      >
        <input
          onFocus={() => setIsFocus(true)}
          onBlur={() => setTimeout(() => setIsFocus(false), 300)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full pl-2 border-0 text-xs text-gray-600"
          placeholder={first ? "Type instant feedback..." : "you@example.com"}
          type="text"
        />
        {text.length > 0 && isFocus && (
          <button
            type="submit"
            onClick={onSubmit}
            className="whitespace-nowrap bg-blue-200 rounded-l-lg  px-3 py-0 text-blue-700"
          >
            {isFocus ? "Press enter to send" : "Send"}
          </button>
        )}
      </form>
    </div>
  );
};

const PermSettings = () => {
  const [permShow, setPermShow] = useState(false);
  return (
    <>
      <button
        onClick={() => setPermShow(!permShow)}
        className="mb-4 focus:outline-none rounded-3xl flex flex-row items-center justify-center text-xs py-1 px-4 bg-blue-50 hover:bg-gray-200 transition duration-150"
      >
        <FaLock size={10} className="text-gray-500 mr-1" />{" "}
        {permShow ? "Hide" : "Show"} permission settings
      </button>
      {permShow && (
        <div className="border mb-3 border-gray-300 rounded-sm bg-gray-100 p-4">
          <ul>
            <li className="text-xs mb-3">
              <span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">
                Anyone
              </span>{" "}
              can join
            </li>
            <li className="text-xs mb-3">
              <span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">
                Anyone
              </span>{" "}
              can add files
            </li>
            <li className="text-xs mb-3">
              <span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">
                Anyone
              </span>{" "}
              can download files
            </li>
            <li className="text-xs mb-3">
              <span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">
                Anyone
              </span>{" "}
              can delete files
            </li>
            <li className="text-xs">
              <span className="p-1 rounded font-bold text-x text-blue-500 bg-blue-200">
                Anyone
              </span>{" "}
              can set playback
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

const whichType = (file) => {
  if (file.type.includes("video")) {
    return "video";
  } else if (file.type.includes("image")) {
    return "image";
  } else if (file.type.includes("audio")) {
    return "audio";
  }
  // else if (file.type == "application/pdf") {
  //   return "pdf"
  // }
  else {
    return "file";
  }
};
