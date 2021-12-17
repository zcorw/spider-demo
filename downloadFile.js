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
const delDirFiles = (dirPath, isDelDir = false) => {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        delDirFiles(fullPath, true);
      } else {
        fs.unlinkSync(fullPath);
      }
    });
    if (isDelDir) fs.rmdirSync(dirPath);
  }
}
module.exports = () => {
  const torrentList = readFileList(path.join(__dirname, 'torrent'));
  torrentList.forEach(filePath => {
    torrentDownload(filePath, '/downloads/animes')
  });
  delDirFiles(path.join(__dirname, 'torrent'));
}
