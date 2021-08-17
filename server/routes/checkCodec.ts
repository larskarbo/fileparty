import { Request, Response } from "express";
import ffprobe from "ffprobe-client";
import { IncomingForm } from "formidable";
import { mkdirp, mkdtemp, remove, rmdir } from "fs-extra";
import { tmpdir } from "os";
import path from "path";
import { CodecInfo } from "../types";

export default async function checkCodec(req: Request, res: Response) {
  const tempPath = await mkdtemp(path.join(tmpdir(), "fileparty-"));
  await mkdirp(tempPath);
  console.log("tempPath: ", tempPath);

  const form = new IncomingForm({
    uploadDir: tempPath,
    maxFileSize: 2 * 1024 * 1024 * 1024, //2 gb,
    keepExtensions: true,
  });

  const { fields, files } = await new Promise((resolve) =>
    form.parse(req, async (err, fields, files) => {
      resolve({ fields, files });
    })
  );

  const file = files.file;
  const filePath = file.path;

  // console.log('file: ', file);

  const videoInfo: {
    streams: CodecInfo[];
  } = await ffprobe(filePath);
  console.log("res: ", videoInfo);

  await remove(filePath);
  await rmdir(tempPath);

  const codecInfo: CodecInfo = {
    codec_name: videoInfo.streams[0].codec_name,
    codec_long_name: videoInfo.streams[0].codec_long_name,
    width: videoInfo.streams[0].width,
    height: videoInfo.streams[0].height,
    format_name: videoInfo.format.format_name,
    format_long_name: videoInfo.format.format_long_name,
    name: file.name,
    size: file.size,
  };

  res.json({
    fields,
    files,
    codecInfo,
  });
}
