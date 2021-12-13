const fs = require('fs');
const util = require('util');
const axios = require('axios');
const ariaP = axios.create({
  baseURL: process.env.ARIA_URL
});
ariaP.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

const toBase64 = (buffer) => {
  return buffer.toString('base64');
}

const getFileBuffer = (filePath) => fs.readFileSync(filePath);

const generateUniqueId = async () => {
  var sourceId = 'Spider' + '_' + Math.round(new Date().getTime() / 1000) + '_' + Math.random();
  var hashedId = await toBase64(Buffer.from(sourceId));

  return hashedId;
}

exports.torrentDownload = async (torrentPath, fileDir) => {
  const buffer = await getFileBuffer(torrentPath);
  const base64 = toBase64(buffer);
  return ariaP.post('/jsonrpc', {
    id: generateUniqueId(),
    jsonrpc: "2.0",
    method: "aria2.addTorrent",
    params: [process.env.ARIA_TOKEN, base64, [], { dir: fileDir }]
  })
}