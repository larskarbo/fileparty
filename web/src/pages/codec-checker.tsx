import axios from "axios";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { SERVER_BASE } from "../app/utils/request";
import { CodecInfo } from "../../../server/types";
import prettyBytes from "pretty-bytes";

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

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr px-24 from-gray-100 to-yellow-50 min-h-screen pt-24">
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
                (isDragActive ? "bg-yellow-800 border-dashed" : "bg-gray-700")
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
              <div className="text-xs text-gray-300">Drop a video file here.</div>
            </div>
          </div>
        )}

        {codecInfo && (
          <div>
            <div>
              <div>Name: {codecInfo.name}</div>
              <div>Size: {prettyBytes(codecInfo.size)}</div>
              <div>
                Codec: {codecInfo.codec_name} ({codecInfo.codec_long_name})
              </div>
              <div>
                Format: {codecInfo.format_name} ({codecInfo.format_long_name})
              </div>
              <div>Height: {codecInfo.height}</div>
              <div>Width: {codecInfo.width}</div>
            </div>
            <button onClick={() => setCodecInfo(null)}>
              Check another one
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
