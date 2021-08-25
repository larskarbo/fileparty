import { Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import { IncomingForm } from "formidable";
import { mkdtemp, remove, rmdir } from "fs-extra";
const fs = require("fs").promises;
import { tmpdir } from "os";
import path from "path";
import { promisify } from "util";
import { CodecInfo } from "../types";
import { slackNotify } from "../utils/slackNotify";

export default async function checkCodec(req: Request, res: Response) {
  const tempPath = await mkdtemp(path.join(tmpdir(), "fileparty-"));
  // await mkdirp(tempPath);
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

  const videoInfo: ffmpeg.FfprobeData = await promisify<
    string,
    ffmpeg.FfprobeData
  >(ffmpeg.ffprobe)(filePath);

  const screenshot = await new Promise((resolve) => {
    ffmpeg(filePath)
      .on("end", function () {
        resolve(filePath);
      })
      .screenshot({
        count: 1,
        folder: tempPath,
        filename: "screenshot",
      });
  });
  console.log("tempPath: ", tempPath);

  const screenshotPath = path.join(tempPath, "screenshot.png");
  const image = await fs.readFile(screenshotPath, { encoding: "base64" });

  await remove(filePath);
  await remove(screenshotPath);
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

  slackNotify("Someone checked codec", codecInfo);

  res.json({
    fields,
    files,
    codecInfo,
    image,
  });
}
