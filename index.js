const fs = require('fs');
const Crawler = require("crawler");
const YAML = require('yaml');
const targetYml = fs.readFileSync('./target.yml', 'utf8');
const targetConf = YAML.parse(targetYml);
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
  console.log(list)
}
const enter = new Crawler({
  maxConnections : 10,
  // This will be called for each crawled page
  callback : function (error, res, done) {
      if(error){
          console.log(error);
      }else{
          var $ = res.$;
          enterProcessor($)
      }
      done();
  }
})

enter.queue(targetConf.url)