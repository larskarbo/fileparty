import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import checkCodec from "./routes/checkCodec";
import { getErrorMessage } from "./utils/getErrorMessage";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:1234",
      "http://localhost:3000",
      "http://localhost:8888",
      "http://localhost:8000",
      "http://horse.loc:3000",
      "http://horse.loc:8888",
      "http://papop.local:3000",
      "https://fileparty.co",
    ],
  })
);

app.use(express.static("public"));

app.use(
  express.json({
    limit: "2000mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.send({ status: "Ok" });
});

app.get("/test", async (req, res) => {
  res.send({ hey: "ho" });
});

app.post("/checkCodec", checkCodec);

app.all("/*", (req, res) => {
  return res.status(404).send({
    message: "Route not found",
  });
});


export default app;
