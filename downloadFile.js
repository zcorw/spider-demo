require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {torrentDownload} = require('./aria');

const readFileList = (dir, filesList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);
    } else {
      filesList.push(fullPath);
    }
  })
  return filesList;
}

const torrentList = readFileList(path.join(__dirname, 'torrent'));
torrentList.forEach(filePath => {
  torrentDownload(filePath, '/downloads/animes')
})