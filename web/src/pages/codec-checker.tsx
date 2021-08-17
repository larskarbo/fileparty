import axios from "axios";
import prettyBytes from "pretty-bytes";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { CodecInfo } from "../../../server/types";
import { SERVER_BASE } from "../app/utils/request";
import videoFile from "../app/graphics/video-file.svg";
import { Link } from "@reach/router";
import logo from "../app/logo.svg";
import SEO from "../templates/seo";

export default function CodecChecker() {
  const [codecInfo, setCodecInfo] = useState<CodecInfo>(null);

  const onDrop = useCallback((acceptedFiles) => {
    const rawFile = acceptedFiles[0];
    console.log("rawFile: ", rawFile);

    // const fileURL = URL.createObjectURL(rawFile);

    var formData = new FormData();
    formData.append("file", rawFile);
    axios
      .post(`${SERVER_BASE}/checkCodec`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(percentCompleted);
        },
      })
      .then((asdf) => {
        console.log("asdf: ", asdf.data);
        setCodecInfo(asdf.data.codecInfo);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/*",
    maxSize: 2 * 1024 * 1024 * 1024,
  });

  console.log("getRootProps():", getRootProps());
  let infos = [];
  if (codecInfo) {
    infos = [
      ["Codec", `${codecInfo.codec_name} (${codecInfo.codec_long_name})`],
      ["Format", `${codecInfo.format_name} (${codecInfo.format_long_name})`],
      ["Size", `${codecInfo.width}x${codecInfo.height}`],
    ];
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr px-24 from-gray-100 to-yellow-50 min-h-screen pt-24">
      <SEO title="Video Codec Checker - FileParty" />
      <div className="max-w-screen-md w-full mb-12">
        <div className="flex items-center">
          <Link to="/" className=" mr-4">
            <img className="w-12 h-12" src={logo} />
          </Link>

          <div className="text-2xl  font-light ">
            FileParty 
          </div>
        </div>
      </div>
      <main className="max-w-screen-md w-full bg-white px-12 py-12 rounded shadow">
        <h1 className="text-4xl font-bold text-black text-center mb-6">
          Video Codec Checker
        </h1>
        <h2 className="text-lg font-light text-gray-800 text-center my-6">
          Check video codec, format and metadata of any video file
        </h2>

        {!codecInfo && (
          <div>
            <div
              className={
                "rounded  my-4 w-full flex flex-col items-center py-20 justify-center h-20 relative  border border-gray-300 shadow-lg group " +
                (isDragActive ? "bg-yellow-800 border-dashed" : "bg-gray-600")
              }
              {...getRootProps()}
            >
              <button
                onClick={getRootProps().onClick}
                className="mb-2 bg-white py-2 px-4 flex flex-row text-gray-500
                border-t border-b border-r border-l rounded"
              >
                Select file <FaUpload className="ml-1 m-auto" />
              </button>
              <input {...getInputProps()} />
              <div className="text-xs text-gray-300">
                Drop a video file here.
              </div>
            </div>
          </div>
        )}

        {codecInfo && (
          <div>
            <div className="bg-gray-100 flex items-center gap-8 rounded p-8 text-sm text-gray-800">
              <div className="w-24">
                <img src={videoFile} />
              </div>
              <div className="gap-2 flex flex-col">
                <div>
                  <span className="font-bold">{codecInfo.name}</span> (
                  {prettyBytes(codecInfo.size)})
                </div>
                {infos.map((line) => (
                  <div className="flex">
                    <div className="w-14  text-gray-600 ">{line[0]}:</div>{" "}
                    <div className="">{line[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="border p-2 mt-2 text-sm"
                onClick={() => setCodecInfo(null)}
              >
                Check another one
              </button>
            </div>
          </div>
        )}
      </main>
      
      <div className="my-8 font-light flex flex-col items-center gap-4 text-gray-500 underline text-sm">
          <div>
            <Link to="/codec-checker/">Online Video Codec Checker</Link>
          </div>
          <div>
            <Link to="/watch-local-videos-with-friends-online/">5 ways to watch local videos with friends online</Link>
          </div>
          
        </div>
    </div>
  );
}
