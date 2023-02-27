const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { Server } = require("socket.io");

const app = express();
app.set("port", 3000);
const httpServer = createServer(app);

app.use(express.static(path.join(__dirname, "../client/")));
app.use("/build/", express.static(path.join(__dirname, "node_modules/three/build")));
app.use("/jsm/", express.static(path.join(__dirname, "node_modules/three/examples/jsm")));

httpServer.listen(app.get("port"), () => {
  console.log("server started on port", app.get("port"));
});

// serial communication --------------------------------------
const parser = new SerialPort({ path: "COM4", baudRate: 115200 }).pipe(new ReadlineParser({ delimiter: "\n" }));

// web sockets -----------------------------------------------
const io = new Server(httpServer);

parser.on("data", (data) => {
  if (data.includes("ypr")) {
    console.log(data);
    io.emit("gyr-data", data);
  }
});
