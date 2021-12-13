const axios = require('axios');
const sendP = axios.create({
  baseURL: process.env.DING_URL
});

sendP.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
sendP.defaults.headers.get["Cache-Control"] = "no-cache";

exports.updated = (name) => {
  sendP.post('', { 
    msgtype: "text", 
    text: { 
      content: `欧尼酱 ${name}更新了`
    } 
  })
}

exports.failed = (name, errorMsg) => {
  sendP.post('', { 
    msgtype: "text", 
    text: { 
      content: `欧尼酱 ${name}下载失败了，好像是这么说的\n${errorMsg}`
    } 
  })
}

exports.over = () => {
  sendP.post('', {
    msgtype: "text", 
    text: { 
      content: `欧尼酱 种子下载好了`
    } 
  })
}

exports.yamlUpdateFailed = (errorMsg) => {
  sendP.post('', {
    msgtype: "text", 
    text: { 
      content: `欧尼酱 配置更新失败了，好像是这么说的\n${errorMsg}`
    } 
  })
}