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

  return (
    <div className="flex flex-col bg-gradient-to-tr px-24 from-gray-100 pt-0 to-yellow-50 min-h-screen">
      <h1 className="text-5xl font-bold text-black text-center pt-40 pb-10">
        <div className="mb-1">Video Codec Checker</div>
      </h1>

      {!codecInfo && (
        <div>
          <button
            onClick={getRootProps().onClick}
            className="ml-4 bg-white p-2 flex flex-row text-gray-500
                border-t border-b border-r border-l rounded"
          >
            Select file <FaUpload className="ml-1 m-auto" />
          </button>
          <input {...getInputProps()} />
          <div
            className={
              "rounded bg-gray-200 h-20 relative  border border-gray-300 shadow-lg group " +
              (isDragActive && "border-yellow-500 border-dashed")
            }
            {...getRootProps()}
          >
            Drop here to upload
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
          <button onClick={() => setCodecInfo(null)}>Check another one</button>
        </div>
      )}
    </div>
  );
}
