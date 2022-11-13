const express = require("express");
const app = express();
const utils = require("./util");
const net = require("node:net");

app.get("/api/lookup", async function(req, res) {
  if (!req.query.query) {
    res.send({
      success: false,
      errorCode: "noQuery",
      message: "No query was provided."
    });
    return;
  }

  let isIp = net.isIP(req.query.query);
  if (isIp == 4 || isIp == 6) isIp = true;
  else isIp = false;

  try {
    let lookup = await utils.lookup(req.query.query, isIp);
    res.send({success: true, ...lookup});
  } catch(err) {
    res.send({success: false, errorCode: "internal", message: (err.message || err.code)});
  }
});

app.listen(8998, "127.0.0.1", function() {
  console.log("backend listening on port 8998 (@ 127.0.0.1)");
});