const util = require("./util");

(async function() {
  let domain = await util.lookup("besties.house", false);
  console.log(domain);
  let ip = await util.lookup("8.8.8.8", true);
  console.log(ip);
})()