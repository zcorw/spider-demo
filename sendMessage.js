const axios = require('axios');

axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.get["Cache-Control"] = "no-cache";

exports.updated = (name) => {
  axios.post(process.env.DING_URL, { 
    msgtype: "text", 
    text: { 
      content: `欧尼酱 ${name}更新了`
    } 
  })
}

exports.failed = (name, errorMsg) => {
  axios.post(process.env.DING_URL, { 
    msgtype: "text", 
    text: { 
      content: `欧尼酱 ${name}下载失败了，好像是这么说的\n${errorMsg}`
    } 
  })
}

exports.over = () => {
  axios.post(process.env.DING_URL, {
    msgtype: "text", 
    text: { 
      content: `欧尼酱 种子下载好了`
    } 
  })
}

exports.yamlUpdateFailed = (errorMsg) => {
  axios.post(process.env.DING_URL, {
    msgtype: "text", 
    text: { 
      content: `欧尼酱 配置更新失败了，好像是这么说的\n${errorMsg}`
    } 
  })
}