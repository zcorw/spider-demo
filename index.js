const fs = require('fs');
const Crawler = require("crawler");
const YAML = require('yaml');
const targetYml = fs.readFileSync('./target.yml', 'utf8');
const targetConf = YAML.parse(targetYml);
let tmpList = [];
// 入口页面获取目标列表
const enterProcessor = ($) => {
  const listDom = $('.post_td').first().find('table').first().find('tr');
  const list = [];
  listDom.map(function(index) {
    if (index === 0) return;
    const item = [];
    $(this).find('td').map(function(j) {
      if (j === 0) {
        item.push(+$(this).text());
      } else if (j === 1) {
        item.push($(this).text());
        item.push($(this).find('a').attr('href'))
      } else if (j === 2) {
        item.push($(this).text());
      }
    })
    list.push(item);
  });
  const filertList = list.filter((item) => {
    const title = item[1];
    const group = item[3];
    const result = title.match(/^\[(.+)\]\[(.+)\](\[更新至\s?[0-9/]+\s?集\]|\[全\s?[0-9/]+\s?集\])/);
    if (result === null) return false;
    return targetConf.list.some(drama => 
      drama.name === result[2] && group.includes(drama.group)
    )
  });
  return filertList.map((item) => {
    return {
      url: item[2].replace(/^http(s)?:\/\/[\w\.]+\//, targetConf.host),
      name: item[1].match(/^\[(.+)\]\[(.+)\]\[(.+)\]/)[2],
    }
  });
}
// 目标页面获取 torrent 下载链接
const productProcessor = ($, name) => {
  const config = targetConf.list.find(item => item.name === name);
  const titleDom = $("div[id^='message_'] p:first-child").filter(function() {
    return $(this).text().includes(config.group)
  })
  const aTag = titleDom.first().parents('.post').find('tr td a').last();
  const torrent = aTag.attr('href');
  const filename = aTag.text();
  const result = torrent.match(/attach\-dialog\-fid\-([0-9]+)\-aid\-([0-9]+)\.htm/);
  const aid = result[2];
  if (config.id !== aid) {
    return { uri: targetConf.host + `attach-download-fid-${result[1]}-aid-${result[2]}.htm`, filename };
  } else {
    return false;
  }
}
var download = new Crawler({
  encoding:null,
  jQuery:false,// set false to suppress warning message.
  callback:function(err, res, done){
      if(err){
          console.error(err.stack);
      }else{
          fs.createWriteStream(res.options.filename).write(res.body);
      }
      
      done();
  }
});

// const torrent = new Crawler()
const product = new Crawler({
  maxConnections : 10,
  // This will be called for each crawled page
  callback : function (error, res, done) {
      if(error){
          console.log(error);
      }else{
          var $ = res.$;
          const options = productProcessor($, res.options.name);
          download.queue(options)
      }
      done();
  }
})
const enter = new Crawler({
  maxConnections : 10,
  // This will be called for each crawled page
  callback : function (error, res, done) {
      if(error){
          console.log(error);
      }else{
          var $ = res.$;
          tmpList = enterProcessor($);
          tmpList.forEach(item => product.queue({ uri: item.url, name: item.name }))
      }
      done();
  }
})

enter.queue(targetConf.url)