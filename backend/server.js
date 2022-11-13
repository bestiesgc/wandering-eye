const express = require("express");
const app = express();
const utils = require("./util");
const net = require("node:net");

app.get("/api/lookup", async function(req, res) {
  const queryDomain = req.query.domain
  if (!queryDomain) {
    res.status(400).json({
      success: false,
      errorCode: "noQueryDomain",
      message: "No domain was provided."
    });
    return;
  }

  let isIp = net.isIP(queryDomain);
  if (isIp == 4 || isIp == 6) isIp = true;
  else isIp = false;

  try {
    let lookup = await utils.lookup(queryDomain, isIp);
    res.json({
      success: true,
      ...lookup
    });
  } catch(err) {
    res.json({
      success: false,
      errorCode: "internal",
      message: (err.message || err.code)
    });
  }
});

app.listen(8998, "127.0.0.1", function() {
  console.log("backend listening on port 8998 (@ 127.0.0.1)");
});